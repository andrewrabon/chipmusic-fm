/* global firebase */
window.onload = function() {
  'use strict';

  const database = firebase.database();
  const storage = firebase.storage().ref();
  const dialogs = document.getElementsByTagName('dialog');
  const headerDom = {
    registerButton: document.getElementById('register-button'),
    loginButton: document.getElementById('login-button'),
    settingsDropdown: document.getElementById('settings-dropdown')
  };
  const playerDom = {
    seekBar: document.querySelector('.song-seek-bar'),
    addButton: document.querySelector('.song-controls__add'),
    backButton: document.querySelector('.song-controls__back'),
    playButton: document.querySelector('.song-controls__play'),
    forwardButton: document.querySelector('.song-controls__forward'),
    likeButton: document.querySelector('.song-controls__like')
  };
  const songCardDom = {
    loadingState: document.querySelector('.song-card__loading-state'),
    loadedState: document.querySelector('.song-card__loaded-state'),
    titleLink: document.querySelector('.song-card__title'),
    artistLink: document.querySelector('.song-card__artist'),
    listenCount: document.querySelector('.song-card__plays'),
    likeCount: document.querySelector('.song-card__likes')
  };

  var user = firebase.auth().currentUser;
  var userSettings = {};
  var userSettingsRef = null;
  var songsRef = null;
  var player;
  var playerCanPlay = false;
  var currentSong = null;
  var currentSongIndex = null;
  var songHistory = [];
  var hasViewedCurrentSong = false;

  // Boilerplate to make collections and events easier to work with.
  HTMLElement.prototype.addClickListener = function(eventHandler) {
    this.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      eventHandler.apply(this, arguments);
    });
  };
  NodeList.prototype.addClickListener = function(clickHandler) {
    this.addEventListener('click', clickHandler);
  };
  NodeList.prototype.addEventListener = function(eventName, eventHandler) {
    [].forEach.call(this, function(element) {
      element.addEventListener(eventName, eventHandler);
    });
  };
  HTMLCollection.prototype.addClickListener = NodeList.prototype.addClickListener;
  HTMLCollection.prototype.addEventListener = NodeList.prototype.addEventListener;

  /**
   * Adds the current song to the user's listen history.
   */
  const addCurrentSongToUserHistory = function() {
    if (user && userSettings && userSettingsRef) {
      userSettings.listenHistory = userSettings.listenHistory ? userSettings.listenHistory : [];
      currentSong.listenTimestamp = Date.now();
      userSettings.listenHistory.push(currentSong);
      userSettingsRef.set(userSettings);
    }
  };

  /**
   * Closes any open dialogs.
   */
  const closeDialogs = function() {
    [].forEach.call(dialogs, function(dialog) {
      if (dialog.open) {
        dialog.close();
      }
    });
  };

  /**
   * Downloads the current song.
   */
  const downloadCurrentSong = function() {
    var anchor = document.createElement('a');
    anchor.href = currentSong.file.url;
    anchor.target = '_blank';
    anchor.rel='noopener';
    anchor.download = currentSong.name;
    anchor.click();
  };

  /**
   * Disables the song buttons, used when loading a new song.
   */
  const disableSongButtons = function() {
    playerDom.seekBar.setAttribute('disabled', '');
    playerDom.addButton.setAttribute('disabled', '');
    playerDom.backButton.setAttribute('disabled', '');
    playerDom.playButton.setAttribute('disabled', '');
    playerDom.forwardButton.setAttribute('disabled', '');
    playerDom.likeButton.setAttribute('disabled', '');
  };

  /**
   * Re-enables the song buttons when a song has loaded enough to play.
   */
  const enableSongButtons = function() {
    playerDom.seekBar.removeAttribute('disabled');
    playerDom.addButton.removeAttribute('disabled');
    toggleBackButton();
    playerDom.playButton.removeAttribute('disabled');
    playerDom.forwardButton.removeAttribute('disabled');
    if (user) {
      playerDom.likeButton.removeAttribute('disabled');
    }
  };

  /**
   * Returns the current song's ID, which is the link minus alphanumeric chars.
   * @returns {String} The current song's ID.
   */
  const getCurrentSongId = function() {
    return currentSong.uuid.replace(/\W/g, '');
  };

  /**
   * Returns the user's ID, which is their email minus alphanumeric chars.
   * @returns {String} The user's ID.
   */
  const getUserId = function() {
    return user.uid;
  };

  /**
   * Handles the display side of the user being logged in.
   * @param {Object} changedUser - If this is being fired from a login event, this is the user.
   */
  const handleUserLogin = async function(changedUser) {
    if (changedUser) {
      user = changedUser;
    } else {
      user = firebase.auth().currentUser;
    }

    if (user) {
      headerDom.registerButton.style.display = 'none';
      headerDom.loginButton.style.display = 'none';
      headerDom.settingsDropdown.style.display = 'inline-block';
      document.querySelector('#settings-dropdown [value="email"]').textContent = user.email;
      if (playerCanPlay) {
        playerDom.likeButton.removeAttribute('disabled');
      }

      var userId = getUserId();
      userSettingsRef = database.ref(`/userSettings/${userId}`);
      var userSettingsSnapchat = await userSettingsRef.once('value');
      userSettings = userSettingsSnapchat.val();
      userSettings = userSettings ? userSettings : {};
    } else {
      headerDom.registerButton.style.display = 'inline-block';
      headerDom.loginButton.style.display = 'inline-block';
      headerDom.settingsDropdown.style.display = 'none';
      playerDom.likeButton.setAttribute('disabled', '');
    }
  };

  /**
   * Determines whether the user has liked the current song.
   * @returns {Boolean} Whether the user has liked the current song.
   */
  const hasUserLikedCurrentSong = function() {
    userSettings.likedSongs = userSettings.likedSongs ? userSettings.likedSongs : {};
    return !!userSettings.likedSongs[getCurrentSongId()];
  };

  /**
   * Loads a song and shoves it into the <audio> element.
   * @param {Boolean} shouldAutoplay - Whether the player should autoplay the song.
   * @param {Boolean} [shouldPlayPreviousSong] - Whether to play the previous song instead of loading a new one.
   */
  const loadSong = async function(shouldAutoplay, shouldPlayPreviousSong) {
    disableSongButtons();
    playerCanPlay = false;
    hasViewedCurrentSong = false;
    songCardDom.loadedState.style.display = 'none';
    songCardDom.loadingState.style.display = 'block';

    var previousSongDifferential;
    if (shouldPlayPreviousSong) {
      // Repeat the current song if >5 seconds have passed, or if there are no more songs left.
      if ((player && player.currentTime > 5) || songHistory.length - 2 < 0) {
        previousSongDifferential = 1;
      } else {
        previousSongDifferential = 2;
      }
      currentSong = songHistory[songHistory.length - previousSongDifferential];
    } else if (typeof shouldGoBack === 'undefined') {
      var lengthSnapchat = await database.ref(`/music/length`).once('value');
      currentSongIndex = Math.floor(Math.random() * lengthSnapchat.val());
      songsRef = database.ref(`/music/songs/${currentSongIndex}`);
      var songSnapchat = await songsRef.once('value');
      currentSong = songSnapchat.val();
      songHistory.push(currentSong);
    }

    var songTitle = currentSong.title;
    var startIndex = currentSong.artist.length + 3;
    songTitle = songTitle.slice(startIndex);

    var likeButtonClassList = playerDom.likeButton.getElementsByClassName('fa')[0].classList;
    if (hasUserLikedCurrentSong()) {
      likeButtonClassList.remove('fa-heart-o');
      likeButtonClassList.add('fa-heart');
    } else {
      likeButtonClassList.add('fa-heart-o');
      likeButtonClassList.remove('fa-heart');
    }
    songCardDom.listenCount.textContent = currentSong.listenCount ? currentSong.listenCount : 0;
    songCardDom.likeCount.textContent = currentSong.likeCount ? currentSong.likeCount : 0;

    // Create the audio element and wire up the event listeners to it.
    player = new Audio(currentSong.file.url);
    player.load();
    player.addEventListener('ended', function() {
      loadSong(true);
    });
    player.addEventListener('play', function(event) {
      var classList = playerDom.playButton.getElementsByClassName('fa')[0].classList;
      classList.remove('fa-play');
      classList.add('fa-pause');
    });
    player.addEventListener('pause', function() {
      var classList = playerDom.playButton.getElementsByClassName('fa')[0].classList;
      classList.add('fa-play');
      classList.remove('fa-pause');
    });
    player.addEventListener('timeupdate', function() {
      playerDom.seekBar.value = player.currentTime;

      if (!hasViewedCurrentSong && !player.paused && player.currentTime > 5) {
        currentSong.listenCount = currentSong.listenCount ? parseInt(currentSong.listenCount, 10) + 1 : 1;
        hasViewedCurrentSong = true;
        database.ref(`/music/songs/${currentSongIndex}/listenCount`).set(currentSong.listenCount);
        songCardDom.listenCount.textContent = currentSong.listenCount;
        addCurrentSongToUserHistory();
      }

      toggleBackButton();
    });
    player.addEventListener('canplay', function() {
      playerCanPlay = true;
      enableSongButtons();
      songCardDom.loadingState.style.display = 'none';
      songCardDom.titleLink.textContent = songTitle;
      songCardDom.titleLink.href = currentSong.link;
      songCardDom.artistLink.textContent = currentSong.artist;
      songCardDom.artistLink.href = 'http://chipmusic.org/' + currentSong.artist;
      songCardDom.loadedState.style.display = 'block';
      playerDom.seekBar.value = 0;
      playerDom.seekBar.max = player.duration;

      if (shouldAutoplay) {
        player.play();
      }
    });
  };

  /**
   * Plays the previous song.
   */
  const playerSkipBackward = function() {
    var shouldAutoplay = !player.paused;
    player.pause();
    loadSong(shouldAutoplay, true);
  };

  /**
   * Plays the next song.
   */
  const playerSkipForward = function() {
    var shouldAutoplay = !player.paused;
    player.pause();
    loadSong(shouldAutoplay);
  };

  /**
   * Sets a loading state on a button.
   * @param {HTMLButtonElement} button - The button to set the loading state on.
   * @param {Boolean} isLoading - Whether the button should be loading or not.
   */
  const setButtonLoading = function(button, isLoading) {
    if (isLoading) {
      const icon = document.createElement('span');
      icon.classList.add('fa', 'fa-spin', 'fa-spinner');
      button.setAttribute('disabled', '');
      button.prepend(icon);
    } else {
      button.removeAttribute('disabled');
      button.querySelector('span').remove();
    }
  };

  /**
   * Toggles the back button's enabled state depending on the current play time and song history.
   * @returns {[type]} [description]
   */
  const toggleBackButton = function() {
    if ((player && player.currentTime > 5) || (songHistory.length > 1)) {
      playerDom.backButton.removeAttribute('disabled');
    } else {
      playerDom.backButton.setAttribute('disabled', '');
    }
  };

  /**
   * Toggles the play/pause state of the player.
   */
  const togglePlaying = function() {
    if (!player.paused) {
      player.pause();
    } else {
      player.play();
    }
  };

  /**
   * Toggles whether the current song is liked by the user.
   */
  const toggleSongLike = function() {
    if (currentSong && songsRef && userSettingsRef) {
      var classList = playerDom.likeButton.getElementsByClassName('fa')[0].classList;
      var likeCount = currentSong.likeCount ? currentSong.likeCount : 0;
      userSettings.likedSongs = userSettings.likedSongs ? userSettings.likedSongs : {};
      if (hasUserLikedCurrentSong()) {
        currentSong.likeCount = likeCount - 1;
        classList.add('fa-heart-o');
        classList.remove('fa-heart');
        userSettings.likedSongs[getCurrentSongId()] = null;
      } else {
        currentSong.likeCount = likeCount + 1;
        classList.remove('fa-heart-o');
        classList.add('fa-heart');
        userSettings.likedSongs[getCurrentSongId()] = currentSong;
      }
      songCardDom.likeCount.textContent = currentSong.likeCount;
      database.ref(`/music/songs/${currentSongIndex}/likeCount`).set(currentSong.likeCount);
      userSettingsRef.set(userSettings);
    }
  };

  /**
   * Populates a given table in the DOM with the
   * @param {HTMLTableElement} table - The table to render rows for.
   * @param {Array} songs - The songs to fill out the rows with.
   * @param {Array} [columns] - String array containing the column keys to show.
   */
  const populateTable = function(table, songs, columns) {
    columns = Array.isArray(columns) ? columns : [];
    if (songs.length === 0) {
      table.innerHTML = `<tr><td>No songs found. 😞</td></tr>`;
    } else {
      table.innerHTML = '';
    }
    var reversedSongs = JSON.parse(JSON.stringify(songs)); // Reverse chronological order.
    reversedSongs.reverse();
    reversedSongs.forEach(function(song) {
      var dateCell = '';
      if (columns.indexOf('listenTimestamp') !== -1) { // TODO: Cleanup.
        const rawDate = new Date(song.listenTimestamp);
        const date = rawDate.toLocaleDateString('en-US');
        const time = `${rawDate.getHours()}:${rawDate.getMinutes()}:${rawDate.getSeconds()}`;
        dateCell = `<td class="inverted-table-cell" title="@ ${time}">${date}</td>`;
      }

      var row = document.createElement('tr');
      row.innerHTML = `<td><a href="${song.link}" target="_blank" rel="noopener">${song.title}</a></td>
        ${dateCell}`;
      table.appendChild(row);
    });
  };

  //
  // Wire up event handlers:
  //

  window.addEventListener('keydown', function(event) {
    if (document.activeElement !== document.body) {
      return;
    }
    switch (event.code) {
      case 'KeyD':
        if (event.shiftKey) {
          downloadCurrentSong();
        }
        break;
      case 'Space':
        togglePlaying();
        break;
      case 'ArrowLeft':
        playerSkipBackward();
        break;
      case 'ArrowRight':
        playerSkipForward();
        break;
      case 'KeyL':
        if (event.shiftKey) {
          toggleSongLike();
        }
        break;
      case 'KeyV':
        window.open(currentSong.link, '_blank');
        break;
    }
  });

  headerDom.registerButton.addClickListener(function(event) {
    document.getElementById('register-dialog').showModal();
  });

  headerDom.loginButton.addClickListener(function(event) {
    document.getElementById('login-dialog').showModal();
  });

  document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.querySelector('[name=register-email]').value;
    const password = form.querySelector('[name=register-password]').value;
    const passwordCheck = form.querySelector('[name=register-password-check]').value;
    const submitButton = form.querySelector('button');
    const dialog = document.getElementById('register-dialog');
    const dialogError = dialog.querySelector('.dialog-error');

    if (password !== passwordCheck && dialogError) {
      dialogError.textContent = 'Error! Passwords do not match.'
      dialogError.style.display = 'block';
      return;
    }

    dialog.classList.add('dialog-loading');
    setButtonLoading(submitButton, true);

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function() {
        dialog.classList.remove('dialog-loading');
        setButtonLoading(submitButton, false);
        dialog.close();
      })
      .catch(function(error) {
        console.error(error);
        setButtonLoading(submitButton, false);
        dialog.classList.remove('dialog-loading');
        // TODO: Error handling.
        // dialog.close();
      });
  });

  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.querySelector('[name=login-email]').value;
    const password = form.querySelector('[name=login-password]').value;
    const submitButton = form.querySelector('button');
    const dialog = document.getElementById('login-dialog');

    dialog.classList.add('dialog-loading');
    setButtonLoading(submitButton, true);

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function() {
        dialog.classList.remove('dialog-loading');
        setButtonLoading(submitButton, false);
        dialog.close();
      })
      .catch(function(error) {
        console.error(error);
        dialog.classList.remove('dialog-loading');
        setButtonLoading(submitButton, false);
        // TODO: Error handling.
      });
  });

  document.querySelector('#settings-dropdown > select').addEventListener('change', function(event) {
    const settingsDropdown = event.currentTarget;
    const menuItemName = settingsDropdown.value;
    settingsDropdown.value = 'email';

    if (menuItemName === 'logout') {
      firebase.auth().signOut()
        .then(() => handleUserLogin(false))
        .catch((error) => console.error(error));
    } else {
      const listenHistory = userSettings.listenHistory ? userSettings.listenHistory : [];
      var likedSongs = [];
      if (userSettings.likedSongs) {
        Object.keys(userSettings.likedSongs).forEach(function(songId) {
          const song = userSettings.likedSongs[songId];
          if (song) {
            likedSongs.push(song);
          }
        });
      }
      switch(menuItemName) {
        case 'history':
          populateTable(document.getElementById('history-table'), listenHistory, ['listenTimestamp']);
          break;
        case 'likes':
          populateTable(document.getElementById('likes-table'), likedSongs);
          break;
      }
      document.getElementById(menuItemName + '-dialog').showModal();
    }
  });

  playerDom.addButton.addClickListener(downloadCurrentSong);

  playerDom.backButton.addClickListener(playerSkipBackward);
  playerDom.playButton.addClickListener(togglePlaying);
  playerDom.forwardButton.addClickListener(playerSkipForward);
  playerDom.likeButton.addClickListener(toggleSongLike);

  playerDom.seekBar.addEventListener('change', function() {
    player.currentTime = playerDom.seekBar.value;
  });

  document.querySelectorAll('.close-dialog-button').addClickListener(closeDialogs);

  document.querySelector('.about-link').addClickListener(function() {
    var dialog = document.getElementById('about-dialog');
    dialog.showModal();
  });

  firebase.auth().onAuthStateChanged(handleUserLogin);

  // Load the initial song.
  loadSong();

  // Polyfills the dialog element for non-Chrome browsers.
  for (var i = 0; i < dialogs.length; i++) {
    dialogPolyfill.registerDialog(dialogs[i]);
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
};

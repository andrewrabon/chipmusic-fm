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
    forwardButton: document.querySelector('.song-controls__forward')
  };
  const songCardDom = {
    loadingState: document.querySelector('.song-card__loading-state'),
    loadedState: document.querySelector('.song-card__loaded-state'),
    titleLink: document.querySelector('.song-card__title'),
    artistLink: document.querySelector('.song-card__artist')
  };

  var user = firebase.auth().currentUser;
  var player;
  var currentSong = null;
  var songHistory = [];

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
   * Disables the song buttons, used when loading a new song.
   */
  const disableSongButtons = function() {
    playerDom.seekBar.setAttribute('disabled', '');
    playerDom.addButton.setAttribute('disabled', '');
    playerDom.backButton.setAttribute('disabled', '');
    playerDom.playButton.setAttribute('disabled', '');
    playerDom.forwardButton.setAttribute('disabled', '');
  };

  /**
   * Re-enables the song buttons when a song has loaded enough to play.
   */
  const enableSongButtons = function() {
    playerDom.seekBar.removeAttribute('disabled');
    playerDom.addButton.removeAttribute('disabled');
    if (songHistory.length > 1) {
      playerDom.backButton.removeAttribute('disabled');
    }
    playerDom.playButton.removeAttribute('disabled');
    playerDom.forwardButton.removeAttribute('disabled');
  };

  /**
   * Handles the display side of the user being logged in.
   */
  const handleUserLogin = function(changedUser) {
    if (changedUser) {
      user = changedUser;
    }

    if (user) {
      headerDom.registerButton.style.display = 'none';
      headerDom.loginButton.style.display = 'none';
      headerDom.settingsDropdown.style.display = 'inline-block';
      document.querySelector('#settings-dropdown [value="email"]').textContent = user.email;
    } else {
      headerDom.registerButton.style.display = 'inline-block';
      headerDom.loginButton.style.display = 'inline-block';
      headerDom.settingsDropdown.style.display = 'none';
    }
  };

  /**
   * Loads a song and shoves it into the <audio> element.
   * @param {Boolean} shouldAutoplay - Whether the player should autoplay the song.
   * @param {Boolean} [shouldPlayPreviousSong] - Whether to play the previous song instead of loading a new one.
   */
  const loadSong = async function(shouldAutoplay, shouldPlayPreviousSong) {
    disableSongButtons();
    songCardDom.loadedState.style.display = 'none';
    songCardDom.loadingState.style.display = 'block';

    if (shouldPlayPreviousSong) {
      currentSong = songHistory[songHistory.length - 2];
      // TODO: Logic for repeating the current song if > 5 seconds have passed.
    } else if (typeof shouldGoBack === 'undefined') {
      var lengthSnapchat = await database.ref(`/music/length`).once('value');
      var songIndex = Math.floor(Math.random() * lengthSnapchat.val());
      var songSnapchat = await database.ref(`/music/songs/${songIndex}`).once('value');
      currentSong = songSnapchat.val();
      songHistory.push(currentSong);
    }

    var songTitle = currentSong.title;
    var startIndex = currentSong.artist.length + 3;
    songTitle = songTitle.slice(startIndex);

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
    player.addEventListener('canplay', function() {
      enableSongButtons();
      songCardDom.loadingState.style.display = 'none';
      songCardDom.titleLink.textContent = songTitle;
      songCardDom.titleLink.href = currentSong.link;
      songCardDom.artistLink.textContent = currentSong.artist;
      songCardDom.artistLink.href = 'http://chipmusic.org/' + currentSong.artist;
      // TODO: plays
      // TODO: faves
      songCardDom.loadedState.style.display = 'block';

      if (shouldAutoplay) {
        player.play();
      }
    });
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
   * Toggles the play/pause state of the player.
   */
  const togglePlaying = function() {
    if (!player.paused) {
      player.pause();
    } else {
      player.play();
    }
  };

  //
  // Wire up event handlers:
  //

  window.addEventListener('keydown', function(event) {
    if (document.activeElement !== document.body) {
      return;
    }
    switch (event.code) {
      case 'Space':
        togglePlaying();
        break;
      case 'ArrowLeft':
        loadSong(true, true);
        break;
      case 'ArrowRight':
        loadSong(true);
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

    dialog.classList.add('dialog-loading');
    setButtonLoading(submitButton, true);

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      console.error(error);
      dialog.close();
    });
    dialog.close();
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

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      console.error(error);
      dialog.close();
    });
    dialog.close();
  });

  document.querySelector('#settings-dropdown > select').addEventListener('change', function(event) {
    const settingsDropdown = event.currentTarget;
    const menuItemName = settingsDropdown.value;
    settingsDropdown.value = 'email';
    document.getElementById(menuItemName + '-dialog').showModal();
  });

  playerDom.addButton.addClickListener(function(event) {
    var anchor = document.createElement('a');
    anchor.href = currentSong.file.url;
    anchor.target = '_blank';
    anchor.download = currentSong.name;
    anchor.click();
  });

  playerDom.backButton.addClickListener(function(event) {
    var shouldAutoplay = !player.paused;
    player.pause();
    loadSong(shouldAutoplay, true);
  });

  playerDom.playButton.addClickListener(function(event) {
    var element = event.currentTarget;
    if (!player.paused) {
      player.pause();
    } else {
      player.play();
    }
  });

  playerDom.forwardButton.addClickListener(function() {
    var shouldAutoplay = !player.paused;
    player.pause();
    loadSong(shouldAutoplay);
  });

  document.querySelectorAll('.close-dialog-button').addClickListener(closeDialogs);

  document.querySelector('.about-link').addClickListener(function() {
    var dialog = document.getElementById('about-dialog');
    dialog.showModal();
  });

  firebase.auth().onAuthStateChanged(handleUserLogin);

  // Load the initial song.
  loadSong();

  // Handle user login.
  handleUserLogin();

  // Polyfills the dialog element for non-Chrome browsers.
  for (var i = 0; i < dialogs.length; i++) {
    dialogPolyfill.registerDialog(dialogs[i]);
  }
};

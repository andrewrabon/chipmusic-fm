/* global firebase */
window.onload = function() {
  const database = firebase.database();
  const storage = firebase.storage().ref();

  /**
   * Gets an element based on its query.
   * @param {string} query - The element query string.
   * @returns {HTMLElement} A single HTML element for the
   */
  const getElement = function(query) {
    var elements = document.querySelectorAll(query);
    if (elements.length === 1) {
      return elements[0];
    } else {
      return elements;
    }
  };

  var player = getElement('#song-player');
  var currentSong = null;
  var songHistory = [];

  /**
   * Adds a click handler to an element.
   * @param {[type]} elements - The element or elements to add a click handler for.
   * @param {Function} eventHandler - What to do when the element is clicked.
   */
  const addClickHandler = function(elements, eventHandler) {
    addEventHandler('click', elements, eventHandler);
  };

  /**
   * Wires a click handler to a specific class of elements.
   * @param {Function} eventHandler - What to do when the element is clicked.
   * @param {HTMLElement[]} elements - The elements to wire up.
   * @param {string} eventName - The eventName to wire to (e.g. click, change, etc.)
   */
  const addEventHandler = function(eventName, elements, eventHandler) {
    if (!isNodeList(elements)) {
      elements = [elements];
    }
    [].forEach.call(elements, function(element) {
      element.addEventListener(eventName, function(event) {
        event.preventDefault();
        event.stopPropagation();
        eventHandler(event, element);
      });
    });
  };

  /**
   * Closes any open dialogs.
   */
  const closeDialogs = function() {
    var dialogs = document.getElementsByTagName('dialog');
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
    getElement('.song-seek-bar').setAttribute('disabled', '');
    getElement('.song-controls__add').setAttribute('disabled', '');
    getElement('.song-controls__back').setAttribute('disabled', '');
    getElement('.song-controls__play').setAttribute('disabled', '');
    getElement('.song-controls__forward').setAttribute('disabled', '');
  };

  /**
   * Re-enables the song buttons when a song has loaded enough to play.
   */
  const enableSongButtons = function() {
    getElement('.song-seek-bar').removeAttribute('disabled');
    getElement('.song-controls__add').removeAttribute('disabled');
    if (songHistory.length > 1) {
      console.log(songHistory);
      getElement('.song-controls__back').removeAttribute('disabled');
    }
    getElement('.song-controls__play').removeAttribute('disabled');
    getElement('.song-controls__forward').removeAttribute('disabled');
  };

  /**
   * Determines if something is a NodeList or HTMLCollection.
   * @param {*} nodes - The nodes to check.
   * @returns {Boolean} Whether the given variable is a NodeList or HTMLCollection.
   */
  function isNodeList(nodes) {
    var stringRepr = Object.prototype.toString.call(nodes);

    return typeof nodes === 'object' &&
      /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) &&
      (typeof nodes.length === 'number') &&
      (nodes.length === 0 || (typeof nodes[0] === "object" && nodes[0].nodeType > 0));
  }

  /**
   * Loads a song and shoves it into the <audio> element.
   * @param {Boolean} shouldAutoplay - Whether the player should autoplay the song.
   * @param {Object} [songToLoad] - The optional song to load. Otherwise will load a random song.
   */
  const loadSong = async function(shouldAutoplay, songToLoad) {
    disableSongButtons();
    getElement('.song-card__loading').style.display = 'block';
    getElement('.song-card__loaded').style.display = 'none';

    if (typeof songToLoad === 'undefined') {
      var lengthSnapchat = await database.ref(`/music/length`).once('value');
      var songIndex = Math.floor(Math.random() * lengthSnapchat.val());
      var songSnapchat = await database.ref(`/music/songs/${songIndex}`).once('value');
      currentSong = songSnapchat.val();
      songHistory.push(currentSong);
    } else {
      // TODO
    }

    var songTitle = currentSong.title;
    var startIndex = currentSong.artist.length + 3;
    songTitle = songTitle.slice(startIndex);
    player = new Audio(currentSong.file.url);
    player.load();

    enableSongButtons();
    getElement('.song-card__loading').style.display = 'none';
    getElement('.song-card__title').textContent = songTitle;
    getElement('.song-card__title').href = currentSong.link;
    getElement('.song-card__artist').textContent = currentSong.artist;
    // TODO: plays
    // TODO: faves
    getElement('.song-card__loaded').style.display = 'block';

    if (shouldAutoplay) {
      player.play();
    }
  };

  // Show the login dialog if this is the user's first visit.
  if (localStorage.getItem('isFirstVisit') !== 'false') {
    getElement('#login-dialog').showModal();
  }

  //
  // Wire up event handlers:
  //

  addEventHandler('change', getElement('.settings-dropdown'), function(event, settingsDropdown) {
    var menuItemName = settingsDropdown.value;
    settingsDropdown.value = 'email';
    var dialog = getElement('#' + menuItemName + '-dialog');
    dialog.showModal();
  });

  addClickHandler(getElement('.login-button'), 'click', function() {
    localStorage.setItem('isFirstVisit', false);
    // TODO
    closeDialogs();
  });

  addClickHandler(getElement('.dont-login-button'), function() {
    localStorage.setItem('isFirstVisit', false);
    closeDialogs();
  });

  addClickHandler(getElement('.song-controls__add'), function(event) {
    // window.open(currentSong.file.url, '_blank');
    var anchor = document.createElement('a');
    anchor.href = currentSong.file.url;
    anchor.target = '_blank';
    anchor.download = currentSong.name;
    anchor.click();
  });

  addClickHandler(getElement('.song-controls__play'), function(event, element) {
    if (!player.paused) {
      player.pause();
      element.getElementsByClassName('fa')[0].classList.add('fa-play');
      element.getElementsByClassName('fa')[0].classList.remove('fa-pause');
    } else {
      player.play();
      element.getElementsByClassName('fa')[0].classList.add('fa-pause');
      element.getElementsByClassName('fa')[0].classList.remove('fa-play');
    }
  });

  addClickHandler(getElement('.song-controls__forward'), function(event) {
    var shouldAutoplay = !player.paused;
    player.pause();
    loadSong(shouldAutoplay);
  });

  addClickHandler(getElement('.close-dialog-button'), closeDialogs);

  addClickHandler(getElement('.about-link'), function() {
    var dialog = document.getElementById('about-dialog');
    dialog.showModal();
  });

  // Load the initial song.
  loadSong();
};
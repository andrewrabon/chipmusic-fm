import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorBar } from 'components/ErrorBar';
import { NavigationButton } from 'components/NavigationButton';
import { SongCredits } from 'components/SongCredits';
import { SongPlayer } from 'components/SongPlayer';
import { LoggedInTabs } from 'components/LoggedInTabs';
import { LoggedOutTabs } from 'components/LoggedOutTabs';
import { Utilities } from 'utils/utilities';
import defaultStill from 'images/defaultStill.png';
import giphy from 'images/giphy.png';
import './App.css';

const EMPTY_SONG = {
  isEmpty: true,
  file: {},
};

export class App extends Component {
  constructor(props) {
    super(props);
    const { pageId } = props;
    this.state = {
      areControlsDisabled: true,
      currentPageId: pageId,
      currentSongIndex: 1,
      gif: {
        link: undefined,
        url: undefined,
      },
      hasLoadedSong: false,
      hasViewedCurrentSong: false,
      history: [],
      isErrorBarVisible: false,
      isInitialLoad: true,
      isSongPlaying: false,
      scrubberPosition: 0,
      shouldSongAutoplay: false,
      song: EMPTY_SONG,
      still: defaultStill,
    };

    this.audioRef = React.createRef();
    this.checkInitialLoadState = this.checkInitialLoadState.bind(this);
    this.fetchGif = this.fetchGif.bind(this);
    this.fetchSong = this.fetchSong.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleScrubberChange = this.handleScrubberChange.bind(this);
    this.handleSkipNext = this.handleSkipNext.bind(this);
    this.handleSkipPrevious = this.handleSkipPrevious.bind(this);
    this.handleSongLoaded = this.handleSongLoaded.bind(this);
    this.handleTimeUpdate = this.handleTimeUpdate.bind(this);
    this.onNavigationButtonClick = this.onNavigationButtonClick.bind(this);
  }

  componentDidMount() {
    this.fetchGif();

    window.addEventListener('click', () => {
      this.checkInitialLoadState();
    });

    window.addEventListener('keydown', (event) => {
      this.checkInitialLoadState();
      const { gif } = this.state;
      const gatsbyFocusWrapper = document.getElementById('gatsby-focus-wrapper');
      if (document.activeElement !== document.body
        && document.activeElement !== gatsbyFocusWrapper) {
        return;
      }
      const { song } = this.state;
      switch (event.code) {
        case 'KeyD':
          if (event.shiftKey) {
            window.open(song.file.url, '_blank');
          }
          break;
        case 'Space':
          this.handlePlayPause();
          break;
        case 'ArrowLeft':
        case 'KeyK':
          this.handleSkipPrevious();
          break;
        case 'ArrowRight':
        case 'KeyJ':
          this.handleSkipNext();
          break;
        case 'KeyL':
          if (event.shiftKey) {
            // toggleSongLike();
          }
          break;
        case 'KeyV':
          window.open(song.link, '_blank');
          break;
        case 'KeyG':
          window.open(gif.link, '_blank');
          break;
        // no default
      }
    });
  }

  onNavigationButtonClick(event, isLoggedIn) {
    event.stopPropagation();
    event.preventDefault();
    const { currentPageId } = this.state;
    let pageId = 'index';
    if (currentPageId === 'index') {
      if (isLoggedIn) {
        pageId = 'favorites';
      } else {
        pageId = 'login';
      }
    }

    this.setState({
      currentPageId: pageId,
    });

    // TODO: This does not currently play well with Gatsby's handling of the back button.
    window.history.pushState({}, '', pageId !== 'index' ? `/${pageId}` : '/');
  }

  async addCurrentSongToUserHistory() {
    const { authUser, database } = this.props;
    const { song } = this.state;
    const userSettingsRef = database.ref(`/userSettings/${authUser.uid}`);
    const userSettingsSnapchat = await userSettingsRef.once('value');
    const userSettings = userSettingsSnapchat.val() || {};
    if (authUser && userSettings && userSettingsRef) {
      userSettings.listenHistory = userSettings.listenHistory ? userSettings.listenHistory : [];
      song.listenTimestamp = Date.now();
      userSettings.listenHistory.push(song);
      userSettingsRef.set(userSettings);
    }
  }

  checkInitialLoadState() {
    const { isInitialLoad } = this.state;
    if (isInitialLoad) {
      this.fetchSong();
      this.setState({ isInitialLoad: false });
    }
  }

  async fetchGif() {
    this.setState({
      gif: {},
    });
    const tag = 'pixel art';
    const giphyUrl = `https://api.giphy.com/v1/gifs/random?api_key=${process.env.GIPHY_API_KEY}&tag=${tag}`;
    const results = await fetch(giphyUrl);
    const gif = await results.json();
    this.setState({
      gif: {
        link: gif.data.url,
        url: gif.data.image_url,
      },
      still: gif.data.images['480w_still'].url,
    });
  }

  async fetchSong(providedSong) {
    const { database } = this.props;
    const { history } = this.state;

    this.setState({
      hasLoadedSong: false,
      hasViewedCurrentSong: false,
      song: EMPTY_SONG,
    });

    let currentSong = providedSong;
    let { currentSongIndex } = this.state;
    if (typeof providedSong === 'undefined') {
      const lengthSnapchat = await database.ref('/music/length').once('value');
      currentSongIndex = Math.floor(Math.random() * lengthSnapchat.val());
      const songsRef = database.ref(`/music/songs/${currentSongIndex}`);
      const songSnapchat = await songsRef.once('value');
      currentSong = songSnapchat.val();
    }

    this.setState({
      currentSongIndex,
      history: history.concat([currentSong]),
      song: currentSong,
    }, () => {
      this.handlePlay();
    });
  }

  handlePlayPause(providedSong) {
    const { isSongPlaying, song } = this.state;
    if (providedSong && song.uuid !== providedSong.uuid) {
      this.fetchSong(providedSong);
    } else if (isSongPlaying) {
      this.handlePause();
    } else {
      this.handlePlay();
    }
  }

  handlePlay() {
    this.audioRef.current.play();
    this.setState({
      isSongPlaying: true,
      shouldSongAutoplay: true,
    });
  }

  handlePause() {
    this.audioRef.current.pause();
    this.setState({
      isSongPlaying: false,
    });
  }

  handleScrubberChange(newTime) {
    this.audioRef.current.currentTime = newTime;
    this.setState({
      areControlsDisabled: true,
    });
  }

  handleSkipNext() {
    this.audioRef.current.pause();
    this.setState({
      areControlsDisabled: true,
      hasLoadedSong: false,
    }, () => {
      this.fetchSong();
      this.fetchGif();
    });
  }

  handleSkipPrevious() {
    const { hasLoadedSong, history } = this.state;

    // Repeat the current song if >5 seconds have passed, or if there are no more songs left.
    let repeatCurrentSong = false;
    const player = this.audioRef.current;
    if ((player && player.currentTime > 5) || history.length - 2 < 0) {
      repeatCurrentSong = true;
      if (hasLoadedSong) {
        this.audioRef.current.currentTime = 0;
      }
    }

    if (!repeatCurrentSong) {
      this.setState({
        history: history.slice(0, history.length - 1),
        song: history[history.length - 2],
      }, this.handlePlay);
      this.fetchGif();
    }
  }

  handleSongLoaded() {
    const { shouldSongAutoplay } = this.state;
    this.setState({
      areControlsDisabled: false,
      hasLoadedSong: true,
    });
    if (shouldSongAutoplay) {
      this.handlePlay();
    }
  }

  handleTimeUpdate(event) {
    const { database } = this.props;
    const { currentSongIndex, hasViewedCurrentSong, song } = this.state;
    const player = this.audioRef.current;
    if (!hasViewedCurrentSong && !player.paused && player.currentTime > 5) {
      song.listenCount = song.listenCount ? parseInt(song.listenCount, 10) + 1 : 1;
      database.ref(`/music/songs/${currentSongIndex}/listenCount`).set(song.listenCount);
      this.setState({
        hasViewedCurrentSong: true,
        song,
      });
      this.addCurrentSongToUserHistory();
    }
    this.setState({
      areControlsDisabled: false,
      scrubberPosition: event.target.currentTime,
    });
  }

  render() {
    const { authUser, database } = this.props;
    const {
      areControlsDisabled,
      currentPageId,
      gif,
      hasLoadedSong,
      isErrorBarVisible,
      isInitialLoad,
      isSongPlaying,
      scrubberPosition,
      shouldSongAutoplay,
      song,
      still,
    } = this.state;

    const duration = hasLoadedSong ? this.audioRef.current.duration : 0;
    const isLoadedSongPaused = hasLoadedSong && !isSongPlaying;

    let hasInvertedColors = false;
    let layoutClassName = `layout-song ${gif.url ? '' : 'layout-song--loading-gif'}`;
    let navigationGlyph = 'account_circle';
    let backgroundGifStyle;
    if (currentPageId !== 'index') {
      hasInvertedColors = true;
      layoutClassName = 'layout-page';
      navigationGlyph = 'home';
    } else if (gif.url) {
      backgroundGifStyle = { backgroundImage: `url('${gif.url}')` };
      if (!isSongPlaying || !shouldSongAutoplay) {
        backgroundGifStyle = {
          backgroundImage: `url('${still}')`,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        };
      }
    }

    const songName = Utilities.getTrueSongName(song.title, song.artist);

    if (hasLoadedSong && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: songName,
        artist: song.artist,
        artwork: [
          { src: still, sizes: '480x480' },
        ],
      });
      navigator.mediaSession.setActionHandler('play', this.handlePlay);
      navigator.mediaSession.setActionHandler('pause', this.handlePause);
      navigator.mediaSession.setActionHandler('previoustrack', this.handleSkipPrevious);
      navigator.mediaSession.setActionHandler('nexttrack', this.handleSkipNext);
    }

    return (
      <div className={`app--${currentPageId}`}>
        <ErrorBar
          isVisible={isErrorBarVisible}
          message="Hello, world."
          onDismiss={() => this.setState({ isErrorBarVisible: false })}
        />
        <div
          className={layoutClassName}
          style={backgroundGifStyle}
        >
          {currentPageId === 'index' ? (
            <SongCredits
              artist={song.artist}
              favoriteCount={song.favoriteCount}
              href={song.link}
              isEmpty={song.isEmpty}
              isVisible={hasLoadedSong}
              key="songCredits"
              name={songName}
              playCount={song.listenCount}
              year={new Date(song.date).getFullYear()}
            />
          ) : [(authUser !== null ? (
            <LoggedInTabs
              authUser={authUser}
              database={database}
              isSongPlaying={isSongPlaying}
              key="loggedInTabs"
              onPlayPauseSong={this.handlePlayPause}
              selectedTabId={currentPageId}
              song={song}
            />
          ) : (
            <LoggedOutTabs key="loggedOutTabs" selectedTabId={currentPageId} />
          ))]}
          <div className="giphy-attribution">
            <a href={gif.link} target="_blank" rel="noopener noreferrer">
              <img src={giphy} alt="Powered by GIPHY" height="15" />
            </a>
          </div>
        </div>
        <NavigationButton
          glyph={navigationGlyph}
          hasInvertedColors={hasInvertedColors}
          onClick={(event) => this.onNavigationButtonClick(event, authUser !== null)}
          style={{
            opacity: hasInvertedColors || isLoadedSongPaused || isInitialLoad ? 1 : undefined,
          }}
        />
        <audio
          onCanPlay={this.handleSongLoaded}
          onEnded={this.handleSkipNext}
          onTimeUpdate={this.handleTimeUpdate}
          ref={this.audioRef}
          src={song.file.url}
        />
        <SongPlayer
          areControlsDisabled={areControlsDisabled && !isInitialLoad}
          duration={duration}
          isSongPlaying={isSongPlaying}
          onScrubberChange={this.handleScrubberChange}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onSkipPrevious={this.handleSkipPrevious}
          onSkipNext={this.handleSkipNext}
          scrubberPosition={scrubberPosition}
          style={{
            opacity: hasInvertedColors || isLoadedSongPaused || isInitialLoad ? 1 : undefined,
          }}
          song={song}
        />
      </div>
    );
  }
}

App.propTypes = {
  authUser: PropTypes.objectOf(PropTypes.any),
  database: PropTypes.objectOf(PropTypes.any).isRequired,
  pageId: PropTypes.string.isRequired,
};

App.defaultProps = {
  authUser: null,
};

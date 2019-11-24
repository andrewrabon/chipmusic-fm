import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ErrorBar } from 'components/ErrorBar';
import { NavigationButton } from 'components/NavigationButton';
import { SongCredits } from 'components/SongCredits';
import { SongPlayer } from 'components/SongPlayer';
import { LoggedInTabs } from 'components/LoggedInTabs';
import { LoggedOutTabs } from 'components/LoggedOutTabs';
import giphy from 'images/giphy.png';
import './App.css';

const EMPTY_SONG = {
  file: {},
};

export class App extends Component {
  constructor(props) {
    super(props);
    const { pageId } = props;
    this.state = {
      currentPageId: pageId,
      gif: {
        link: undefined,
        url: undefined,
      },
      gifStill: 'https://i.imgur.com/GmgOsB3.png',
      hasLoadedSong: false,
      history: [],
      isErrorBarVisible: false,
      isSongPlaying: false,
      shouldSongAutoplay: false,
      scrubberPosition: 0,
      song: EMPTY_SONG,
    };

    this.audioRef = React.createRef();
    this.fetchGif = this.fetchGif.bind(this);
    this.fetchSong = this.fetchSong.bind(this);
    this.handlePlay = this.handlePlay.bind(this);
    this.handlePause = this.handlePause.bind(this);
    this.handleScrubberChange = this.handleScrubberChange.bind(this);
    this.handleSkipNext = this.handleSkipNext.bind(this);
    this.handleSkipPrevious = this.handleSkipPrevious.bind(this);
    this.handleSongLoaded = this.handleSongLoaded.bind(this);
    this.onNavigationButtonClick = this.onNavigationButtonClick.bind(this);
  }

  componentDidMount() {
    this.fetchSong();
    this.fetchGif();
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

  async fetchGif() {
    this.setState({
      gif: {},
    });
    const results = await fetch(process.env.GATSBY_GIPHY_RANDOM_ENDPOINT);
    const gif = await results.json();
    this.setState({
      gif: {
        link: gif.data.url,
        url: gif.data.image_url,
      },
      gifStill: gif.data.images['480w_still'].url,
    });
  }

  async fetchSong() {
    const { database } = this.props;
    const { history, shouldSongAutoplay } = this.state;
    const lengthSnapchat = await database.ref('/music/length').once('value');
    const currentSongIndex = Math.floor(Math.random() * lengthSnapchat.val());
    const songsRef = database.ref(`/music/songs/${currentSongIndex}`);
    const songSnapchat = await songsRef.once('value');
    const currentSong = songSnapchat.val();
    this.setState({
      history: history.concat([currentSong]),
      song: currentSong,
    }, () => {
      if (shouldSongAutoplay) {
        this.handlePlay();
      }
    });
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
  }

  handleSkipNext() {
    this.setState({
      hasLoadedSong: false,
    });
    this.fetchSong();
    this.fetchGif();
  }

  handleSkipPrevious() {
    const { hasLoadedSong, history } = this.state;

    // Repeat the current song if >5 seconds have passed, or if there are no more songs left.
    let repeatCurrentSong = false;
    const player = null; // TODO: Put <audio> in here and pass to SongPlayer.
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
    }

    if (hasLoadedSong) {
      this.fetchGif();
    }
  }

  handleSongLoaded() {
    this.setState({
      hasLoadedSong: true,
    });
  }

  render() {
    const { authUser } = this.props;
    const {
      currentPageId,
      gif,
      gifStill,
      hasLoadedSong,
      isErrorBarVisible,
      isSongPlaying,
      scrubberPosition,
      song,
    } = this.state;

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
    }

    let songName = song.title;
    if (songName) {
      songName = song.title.slice(song.artist.length + 3);
    }

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: songName,
        artist: song.artist,
        artwork: [
          { src: gifStill, sizes: '480x480', type: 'image/jpg' },
        ],
      });
      navigator.mediaSession.setActionHandler('play', this.handlePlay);
      navigator.mediaSession.setActionHandler('pause', this.handlePause);
      navigator.mediaSession.setActionHandler('previoustrack', this.handleSkipPrevious);
      navigator.mediaSession.setActionHandler('nexttrack', this.handleSkipNext);
    }

    return (
      <>
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
              isVisible={hasLoadedSong}
              key="songCredits"
              name={songName}
              playCount={song.playCount}
            />
          ) : [(authUser !== null ? (
            <LoggedInTabs
              isSongPlaying={isSongPlaying}
              key="loggedInTabs"
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
        />
        <audio
          onCanPlay={this.handleSongLoaded}
          onTimeUpdate={(event) => this.setState({ scrubberPosition: event.target.currentTime })}
          ref={this.audioRef}
          src={song.file.url}
        />
        <SongPlayer
          isSongPlaying={isSongPlaying}
          onScrubberChange={this.handleScrubberChange}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onSkipPrevious={this.handleSkipPrevious}
          onSkipNext={this.handleSkipNext}
          scrubberPosition={scrubberPosition}
          song={song}
        />
      </>
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

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

const FAKE_SONG = {
  artist: 'Solomonster',
  favoriteCount: 6,
  link: 'https://chipmusic.org/Solomonster/music/dont-fall-down',
  name: 'Don\'t Fall Down',
  playCount: 14,
  file: {
    url: 'https://chipmusic.s3.amazonaws.com/music/2016/04/solomonster_dont-fall-down.mp3',
  },
};

export class App extends Component {
  constructor(props) {
    super(props);
    const { pageId } = props;
    this.state = {
      currentPageId: pageId,
      gif: {
        url: undefined,
        link: undefined,
      },
      hasLoadedSong: true, // This is to trick Gatsby into rendering SongCredits for no-JS mode.
      isErrorBarVisible: false,
      song: FAKE_SONG,
    };
    this.handleSkipNext = this.handleSkipNext.bind(this);
    this.handleSkipPrevious = this.handleSkipPrevious.bind(this);
    this.onNavigationButtonClick = this.onNavigationButtonClick.bind(this);
  }

  componentDidMount() {
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
    });
  }

  handleSkipNext() {
    this.fetchGif();
    this.setState({
      hasLoadedSong: false,
      isErrorBarVisible: true,
      song: {
        link: 'https://chipmusic.org/Azuria/music/day-in-dream-oh-well',
        file: {
          url: 'https://chipmusic.s3.amazonaws.com/music/2012/04/azuria_day-in-dream-oh-well_1.mp3',
        },
        artist: 'Azuria',
        name: 'Day In Dream (Oh Well)',
        favoriteCount: 0,
        playCount: 2,
      },
    });
  }

  handleSkipPrevious() {
    this.fetchGif();
    this.setState({
      hasLoadedSong: false,
      song: FAKE_SONG,
    });
  }

  render() {
    const { authUser } = this.props;
    const {
      currentPageId, gif, hasLoadedSong, isErrorBarVisible, song,
    } = this.state;
    let hasInvertedColors = false;
    let layoutClassName = `layout-song ${hasLoadedSong ? '' : 'layout-song--loading'}`;
    let navigationGlyph = 'account_circle';
    let backgroundGifStyle;
    if (currentPageId !== 'index') {
      hasInvertedColors = true;
      layoutClassName = 'layout-page';
      navigationGlyph = 'home';
    } else if (hasLoadedSong) {
      backgroundGifStyle = { backgroundImage: `url('${gif.url}')` };
    }

    return (
      <>
        <ErrorBar
          isVisible={isErrorBarVisible}
          message="Hello, world."
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
              name={song.name}
              playCount={song.playCount}
            />
          ) : [(authUser !== null ? (
            <LoggedInTabs key="loggedInTabs" selectedTabId={currentPageId} />
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
        <SongPlayer
          onSkipPrevious={this.handleSkipPrevious}
          onSkipNext={this.handleSkipNext}
          onSongLoaded={() => this.setState({ hasLoadedSong: true })}
          song={song}
        />
      </>
    );
  }
}

App.propTypes = {
  authUser: PropTypes.objectOf(PropTypes.any),
  pageId: PropTypes.string.isRequired,
};

App.defaultProps = {
  authUser: null,
};

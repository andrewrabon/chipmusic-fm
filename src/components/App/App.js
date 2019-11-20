import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  name: 'Don\'t Fall Down',
  playCount: 14,
  url: 'https://chipmusic.s3.amazonaws.com/music/2016/04/solomonster_dont-fall-down.mp3',
};

export class App extends Component {
  constructor(props) {
    super(props);
    const { pageId } = props;
    this.state = {
      currentPageId: pageId,
      gifUrl: undefined,
      hasLoadedSong: true, // This is to trick Gatsby into rendering SongCredits for no-JS mode.
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
    const results = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${process.env.GATSBY_GIPHY_API_KEY}&tag=pixel art`);
    const gif = await results.json();
    this.setState({
      gifUrl: gif.data.image_url,
    });
  }

  handleSkipNext() {
    this.fetchGif();
    this.setState({
      hasLoadedSong: false,
      song: {
        url: 'https://chipmusic.s3.amazonaws.com/music/2012/04/azuria_day-in-dream-oh-well_1.mp3',
        artist: 'Azuria',
        name: 'Day in Dream Oh Well',
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
      currentPageId, gifUrl, hasLoadedSong, song,
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
      backgroundGifStyle = { backgroundImage: `url('${gifUrl}')` };
    }

    return (
      <>
        <div
          className={layoutClassName}
          style={backgroundGifStyle}
        >
          {currentPageId === 'index' ? (
            <SongCredits
              artist={song.artist}
              favoriteCount={song.favoriteCount}
              isVisible={hasLoadedSong}
              key="songCredits"
              name={song.name}
              playCount={song.playCount}
              url={song.url}
            />
          ) : [(authUser !== null ? (
            <LoggedInTabs key="loggedInTabs" selectedTabId={currentPageId} />
          ) : (
            <LoggedOutTabs key="loggedOutTabs" selectedTabId={currentPageId} />
          ))]}
          <div className="giphy-attribution">
            <a href="https://giphy.com" target="_blank" rel="noopener noreferrer">
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

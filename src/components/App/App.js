import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AuthUserContext } from 'components/Firebase';
import { NavigationButton } from 'components/NavigationButton';
import { SongCredits } from 'components/SongCredits';
import { SongPlayer } from 'components/SongPlayer';
import { LoggedInTabs } from 'components/LoggedInTabs';
import { LoggedOutTabs } from 'components/LoggedOutTabs';
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    const { pageId } = props;
    this.state = {
      currentPageId: pageId,
      song: {
        name: 'Don\'t Fall Down',
        url: 'https://chipmusic.s3.amazonaws.com/music/2016/04/solomonster_dont-fall-down.mp3',
      },
    };
    this.onNavigationButtonClick = this.onNavigationButtonClick.bind(this);
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

  render() {
    const { currentPageId, song } = this.state;
    let hasInvertedColors = false;
    let layoutClassName = 'layout-song';
    let navigationGlyph = 'account_circle';
    if (currentPageId !== 'index') {
      hasInvertedColors = true;
      layoutClassName = 'layout-page';
      navigationGlyph = 'home';
    }
    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <>
            <div className={layoutClassName}>
              {currentPageId === 'index' ? (
                <SongCredits
                  artist="IAYD"
                  favoriteCount={6}
                  key="songCredits"
                  playCount={18}
                  title="When I Sleep, My Heart Speaks"
                />
              ) : [(authUser !== null ? (
                <LoggedInTabs key="loggedInTabs" selectedTabId={currentPageId} />
              ) : (
                <LoggedOutTabs key="loggedOutTabs" selectedTabId={currentPageId} />
              ))]}
            </div>
            <NavigationButton
              glyph={navigationGlyph}
              hasInvertedColors={hasInvertedColors}
              onClick={(event) => this.onNavigationButtonClick(event, authUser !== null)}
            />
            <SongPlayer
              song={song}
            />
          </>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

App.propTypes = {
  pageId: PropTypes.string.isRequired,
};

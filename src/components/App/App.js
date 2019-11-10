import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AuthUserContext } from 'components/Firebase';
import { Navigation } from 'components/Navigation';
import { Player } from 'components/Player';
import { SongCredits } from 'components/SongCredits';
import { LoggedInTabs } from 'components/LoggedInTabs';
import { LoggedOutTabs } from 'components/LoggedOutTabs';
import './App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    const { pageId } = props;
    this.state = {
      currentPageId: pageId,
    };
    this.onNavigationClick = this.onNavigationClick.bind(this);
  }

  onNavigationClick(event, isLoggedIn) {
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
  }

  render() {
    const { currentPageId } = this.state;
    let layoutClassName = 'layout-song';
    let hasInvertedColors = false;
    let navigationGlyph = 'account_circle';
    if (currentPageId !== 'index') {
      layoutClassName = 'layout-page';
      hasInvertedColors = true;
      navigationGlyph = 'home';
    }
    return (
      <AuthUserContext.Consumer>
        {(authUser) => (
          <>
            <div className={layoutClassName}>
              {currentPageId === 'index' ? (
                <SongCredits
                  artist="Artist"
                  title="Song Title"
                  playCount={95}
                  favoriteCount={91}
                />
              ) : [(authUser !== null ? (
                <LoggedInTabs selectedTab={currentPageId} />
              ) : (
                <LoggedOutTabs selectedTab={currentPageId} />
              ))]}
            </div>
            <Navigation
              glyph={navigationGlyph}
              hasInvertedColors={hasInvertedColors}
              onClick={(event) => this.onNavigationClick(event, authUser !== null)}
            />
            <Player />
          </>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

App.propTypes = {
  pageId: PropTypes.string.isRequired,
};

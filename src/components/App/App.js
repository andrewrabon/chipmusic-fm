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
                <LoggedInTabs key="loggedInTabs" selectedTab={currentPageId} />
              ) : (
                <LoggedOutTabs key="loggedOutTabs" selectedTab={currentPageId} />
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

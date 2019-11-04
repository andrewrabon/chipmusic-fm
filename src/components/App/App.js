import React, { Component } from 'react';
import { Navigation } from 'components/Navigation';
import { Player } from 'components/Player';
import { SongCredits } from 'components/SongCredits';
import { TabbedContainer } from 'components/TabbedContainer';
import './App.css';

const ACCOUNT_TABS = [
  {
    id: 'favorites',
    display: 'Favorites',
    child: (<div>Favorites</div>),
  }, {
    id: 'history',
    display: 'History',
    child: (<div>History</div>),
  }, {
    id: 'settings',
    display: 'Settings',
    child: (<div>Settings</div>),
  }, {
    id: 'about',
    display: 'About',
    child: (<div>About</div>),
  },
];

const LOGIN_TABS = [
  {
    id: 'login',
    display: 'Login',
    child: (<div>Login</div>),
  }, {
    id: 'register',
    display: 'Register',
    child: (<div>Register</div>),
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPageId: props.pageId,
      navigationGlyph: 'account_circle',
      navigationLink: '/login',
    };
    this.onNavigationClick = this.onNavigationClick.bind(this);
  }

  onNavigationClick(event) {
    event.stopPropagation();
    event.preventDefault();
    const { currentPageId } = this.state;
    let pageId = 'index';
    const isLoggedIn = true;
    if (currentPageId === 'index') {
      if (isLoggedIn) {
        pageId = 'favorites';
      } else {
        pageId = 'login';
      }
    }

    let navigationGlyph = 'account_circle';
    let navigationLink = '/login'; // TODO: Make constants.
    if (pageId !== 'index') {
      navigationGlyph = 'home';
      navigationLink = '/';
    }
    this.setState({
      currentPageId: pageId,
      navigationGlyph,
      navigationLink,
    });
  }

  render() {
    const { currentPageId, navigationGlyph, navigationLink } = this.state;
    const isLoggedIn = true;

    let layoutClassName;
    let content;
    if (currentPageId === 'index') {
      layoutClassName = 'layout-song';
      content = (
        <SongCredits
          artist="Artist"
          title="Song Title"
          playCount={95}
          favoriteCount={91}
        />
      );
    } else {
      layoutClassName = 'layout-page';
      if (isLoggedIn) {
        content = (<TabbedContainer tabs={ACCOUNT_TABS} />);
      } else {
        content = (<TabbedContainer tabs={LOGIN_TABS} />);
      }
    }
    return (
      <article className={layoutClassName}>
        {content}
        <Navigation
          glyph={navigationGlyph}
          link={navigationLink}
          page={currentPageId}
          onClick={this.onNavigationClick}
        />
        <Player />
      </article>
    );
  }
}

export { App };

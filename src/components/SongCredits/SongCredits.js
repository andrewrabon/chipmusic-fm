import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './SongCredits.css';

class SongCredits extends Component {
  render() {
    const {
      artist,
      title,
      playCount,
      favoriteCount,
    } = this.props;

    return (
      <a href="/#" className="song-credits">
        <h1>{artist}</h1>
        <h2>
          &ldquo;
          {title}
          &rdquo;
        </h2>
        <h3>
          {playCount}
          {' '}
          play &middot;
          {' '}
          {favoriteCount}
          {' '}
          favorites
        </h3>
      </a>
    );
  }
}

export { SongCredits };

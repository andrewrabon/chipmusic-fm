import React from 'react';
import PropTypes from 'prop-types';
import giphy from 'images/giphy.png';
import './SongCredits.css';

export const SongCredits = (props) => {
  const {
    artist,
    title,
    playCount,
    favoriteCount,
  } = props;

  return (
    <>
      <a className="song-credits" href="#/" target="_blank">
        <h1>{artist}</h1>
        <h2>
          &ldquo;
          {title}
          &rdquo;
        </h2>
        <h3>
          {playCount}
          {' '}
          plays &middot;
          {' '}
          {favoriteCount}
          {' '}
          favorites
        </h3>
      </a>
      <div className="giphy-attribution">
        <a href="#/" target="_blank">
          <img src={giphy} alt="Powered by GIPHY" height="15" />
        </a>
      </div>
    </>
  );
};

SongCredits.propTypes = {
  artist: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  playCount: PropTypes.number.isRequired,
  favoriteCount: PropTypes.number.isRequired,
};

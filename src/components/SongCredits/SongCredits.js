import React from 'react';
import PropTypes from 'prop-types';
import './SongCredits.css';

export const SongCredits = (props) => {
  const {
    artist,
    favoriteCount,
    href,
    isVisible,
    name,
    playCount,
  } = props;

  const songCreditsVisibleStyle = isVisible ? 'song-credits--visible' : '';
  const favoritesMarkup = favoriteCount === 0 ? undefined : (
    <>
      {' '}
      &middot;
      {' '}
      {favoriteCount}
      {' '}
      favorites
    </>
  );

  return (
    <a
      className={`song-credits ${songCreditsVisibleStyle}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h1>{artist}</h1>
      <h2>
        &ldquo;
        {name}
        &rdquo;
      </h2>
      <h3>
        {playCount}
        {' '}
        plays
        {favoritesMarkup}
      </h3>
    </a>
  );
};

SongCredits.propTypes = {
  artist: PropTypes.string,
  favoriteCount: PropTypes.number,
  href: PropTypes.string,
  isVisible: PropTypes.bool.isRequired,
  name: PropTypes.string,
  playCount: PropTypes.number,
};

SongCredits.defaultProps = {
  artist: '',
  favoriteCount: 0,
  href: '/',
  name: '',
  playCount: 0,
};

import React from 'react';
import PropTypes from 'prop-types';
import './SongCredits.css';

export const SongCredits = (props) => {
  const {
    artist,
    favoriteCount,
    href,
    isEmpty,
    isVisible,
    name,
    playCount,
    year,
  } = props;

  const songCreditsVisibleClassName = isVisible ? 'song-credits--visible' : '';
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
      className={`song-credits ${songCreditsVisibleClassName}`}
      href={href}
      rel="noopener noreferrer"
      style={{
        display: isEmpty ? 'none' : undefined,
      }}
      target="_blank"
    >
      <h1>{artist}</h1>
      <h2>
        &ldquo;
        {name}
        &rdquo;
      </h2>
      <h3>
        {year}
        {' '}
        &middot;
        {' '}
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
  isEmpty: PropTypes.bool,
  isVisible: PropTypes.bool.isRequired,
  name: PropTypes.string,
  playCount: PropTypes.number,
  year: PropTypes.number,
};

SongCredits.defaultProps = {
  artist: '',
  favoriteCount: 0,
  href: '/',
  isEmpty: false,
  name: '',
  playCount: 0,
  year: '',
};

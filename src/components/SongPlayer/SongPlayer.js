import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SongPlayer.css';

export const SongPlayer = (props) => {
  const { song } = props;
  const [songState, setSongState] = useState(song);
  const [scrubberPosition, setScrubberPosition] = useState(0);

  const getRandomSong = () => ({
    url: 'https://chipmusic.s3.amazonaws.com/music/2010/05/phib3r-optik_1-1.mp3',
  });
  const onScrubberChange = (event) => setScrubberPosition(event.target.value);
  const onSkipNextClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSongState(getRandomSong());
  };

  return (
    <div className="player">
      <audio
        src={songState.url}
        controls
      />
      <input
        className="player__scrubber"
        min="0"
        onChange={onScrubberChange}
        step="0.01"
        type="range"
        value={scrubberPosition}
      />
      <a href="/#" className="player__control" target="_blank" download>
        <span className="material-icons">cloud_download</span>
      </a>
      <button className="player__control" type="button">
        <span className="material-icons">skip_previous</span>
      </button>
      <button className="player__control" type="button">
        <span className="material-icons">play_circle_filled</span>
      </button>
      <button className="player__control" type="button" onClick={onSkipNextClick}>
        <span className="material-icons">skip_next</span>
      </button>
      <button className="player__control" type="button">
        <span className="material-icons">favorite_border</span>
      </button>
    </div>
  );
};

SongPlayer.propTypes = {
  song: PropTypes.objectOf(PropTypes.any).isRequired,
};

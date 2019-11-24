import React from 'react';
import PropTypes from 'prop-types';
import './SongPlayer.css';

export const SongPlayer = (props) => {
  const {
    duration,
    isSongPlaying,
    onPlay,
    onPause,
    onScrubberChange,
    onSkipPrevious,
    onSkipNext,
    scrubberPosition,
    song,
  } = props;

  const handleScrubberChange = (event) => {
    const { value } = event.target;
    onScrubberChange(value);
  };
  const handlePlayPauseClick = () => {
    if (isSongPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  return (
    <div className="player">
      <input
        className="player__scrubber"
        min="0"
        max={duration > 0 ? duration : 0}
        onChange={handleScrubberChange}
        step="0.01"
        type="range"
        value={scrubberPosition}
      />
      <a
        href={song.file.url}
        className="player__control"
        rel="noopener noreferrer"
        target="_blank"
        download={song.name}
      >
        <span className="material-icons">cloud_download</span>
      </a>
      <button
        className="player__control"
        onClick={onSkipPrevious}
        type="button"
      >
        <span className="material-icons">skip_previous</span>
      </button>
      <button
        className="player__control"
        onClick={handlePlayPauseClick}
        type="button"
      >
        <span className="material-icons">
          {isSongPlaying ? 'pause_circle_filled' : 'play_circle_filled'}
        </span>
      </button>
      <button
        className="player__control"
        type="button"
        onClick={onSkipNext}
      >
        <span className="material-icons">skip_next</span>
      </button>
      <button className="player__control" type="button">
        <span className="material-icons">favorite_border</span>
      </button>
    </div>
  );
};

SongPlayer.propTypes = {
  duration: PropTypes.number.isRequired,
  isSongPlaying: PropTypes.bool.isRequired,
  onScrubberChange: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onSkipNext: PropTypes.func.isRequired,
  onSkipPrevious: PropTypes.func.isRequired,
  scrubberPosition: PropTypes.number.isRequired,
  song: PropTypes.objectOf(PropTypes.any).isRequired,
};

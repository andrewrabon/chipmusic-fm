import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './SongPlayer.css';

export const SongPlayer = (props) => {
  const {
    song, onSkipPrevious, onSkipNext, onSongLoaded,
  } = props;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubberPosition, setScrubberPosition] = useState(0);

  const handleScrubberChange = (event) => {
    const { value } = event.target;
    audioRef.current.currentTime = value;
    setScrubberPosition(value);
  };
  const handlePlayPauseClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="player">
      <audio
        onCanPlay={onSongLoaded}
        onTimeUpdate={(event) => setScrubberPosition(event.target.currentTime)}
        ref={audioRef}
        src={song.file.url}
      />
      <input
        className="player__scrubber"
        min="0"
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
          {isPlaying ? 'pause_circle_filled' : 'play_circle_filled'}
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
  onSkipNext: PropTypes.func.isRequired,
  onSkipPrevious: PropTypes.func.isRequired,
  onSongLoaded: PropTypes.func.isRequired,
  song: PropTypes.objectOf(PropTypes.any).isRequired,
};

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './SongPlayer.css';

export const SongPlayer = (props) => {
  const { song } = props;
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songState, setSongState] = useState(song);
  const [scrubberPosition, setScrubberPosition] = useState(0);

  const getRandomSong = () => ({
    name: 'Optik 1-1',
    url: 'https://chipmusic.s3.amazonaws.com/music/2010/05/phib3r-optik_1-1.mp3',
  });
  const handleScrubberChange = (event) => setScrubberPosition(event.target.value);
  const handleSkipPreviousClick = (event) => setSongState(getRandomSong(event));
  const handlePlayPauseClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleSkipNextClick = (event) => setSongState(getRandomSong(event));

  return (
    <div className="player">
      <audio
        onTimeUpdate={(event) => setScrubberPosition(event.target.currentTime)}
        ref={audioRef}
        src={songState.url}
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
        href={songState.url}
        className="player__control"
        rel="noopener noreferrer"
        target="_blank"
        download={songState.name}
      >
        <span className="material-icons">cloud_download</span>
      </a>
      <button
        className="player__control"
        onClick={handleSkipPreviousClick}
        type="button"
      >
        <span className="material-icons">skip_previous</span>
      </button>
      <button className="player__control" onClick={handlePlayPauseClick} type="button">
        <span className="material-icons">
          {isPlaying ? 'pause_circle_filled' : 'play_circle_filled'}
        </span>
      </button>
      <button
        className="player__control"
        type="button"
        onClick={handleSkipNextClick}
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
  song: PropTypes.objectOf(PropTypes.any).isRequired,
};

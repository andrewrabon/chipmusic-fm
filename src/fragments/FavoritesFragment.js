import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Utilities } from 'utils/utilities';
import 'firebase/auth';
import 'firebase/database';

export class FavoritesFragment extends Component {
  constructor() {
    super();
    this.state = {
      hasLoadedSongs: false,
      likedSongs: {},
    };
    this.fetchUserSettings = this.fetchUserSettings.bind(this);
    this.handleFavorite = this.handleFavorite.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
  }

  componentDidMount() {
    this.fetchUserSettings();
  }

  async fetchUserSettings() {
    const { authUser, database } = this.props;
    const userSettingsSnapchat = await database.ref(`/userSettings/${authUser.uid}`).once('value');
    const userSettings = userSettingsSnapchat.val();
    let likedSongs = {};
    if (userSettings && userSettings.likedSongs) {
      likedSongs = userSettings.likedSongs;
    }
    this.setState({
      hasLoadedSongs: true,
      likedSongs,
    });
  }

  handleFavorite(event, song) {
    event.preventDefault();
    event.stopPropagation();
  }

  handlePlayPause(event, song) {
    const { onPlayPauseSong } = this.props;
    onPlayPauseSong(song);
  }

  render() {
    const { isSongPlaying, song: propsSong } = this.props;
    const { hasLoadedSongs, likedSongs } = this.state;
    const likedSongKeys = Object.keys(likedSongs);

    let message;
    if (!hasLoadedSongs) {
      message = 'Loading...';
    } else if (likedSongKeys.length === 0) {
      message = (
        <>
          <p>
            You don&apos;t have any favorite songs.
            {' '}
            <span role="img" aria-label="Heartbroken">
              💔
            </span>
          </p>
          <p>
            ...yet.
            {' '}
            <span role="img" aria-label="Wink">😉</span>
          </p>
        </>
      );
    }

    return (
      <>
        {message}
        <table style={{ display: hasLoadedSongs ? undefined : 'none' }}>
          <tbody>
            {
              likedSongKeys.map((songId) => {
                const song = likedSongs[songId];
                const songName = Utilities.getTrueSongName(song.title, song.artist);
                let playPauseIcon = 'play_circle_outline';
                if (propsSong && song.uuid === propsSong.uuid && isSongPlaying) {
                  playPauseIcon = 'pause_circle_outline';
                }
                return (
                  <tr
                    key={song.uuid}
                    onClick={(event) => this.handlePlayPause(event, song)}
                    onKeyPress={(event) => this.handleFavorite(event, song)}
                    role="button"
                    tabIndex={0}
                  >
                    <td style={{ width: '100%' }}>
                      <strong>{songName}</strong>
                      {' '}
                      &middot;
                      {' '}
                      {song.artist}
                      {' '}
                      &middot;
                      {' '}
                      {new Date(song.date).getFullYear()}
                    </td>
                    <td>
                      <span
                        className="material-icons"
                        onClick={(event) => this.handleFavorite(event, song)}
                        onKeyPress={(event) => this.handleFavorite(event, song)}
                        role="button"
                        tabIndex={0}
                      >
                        favorite_filled
                      </span>
                    </td>
                    <td>
                      <span className="material-icons">{playPauseIcon}</span>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </>
    );
  }
}

FavoritesFragment.propTypes = {
  authUser: PropTypes.objectOf(PropTypes.any).isRequired,
  database: PropTypes.objectOf(PropTypes.any).isRequired,
  isSongPlaying: PropTypes.bool.isRequired,
  onPlayPauseSong: PropTypes.func.isRequired,
  song: PropTypes.objectOf(PropTypes.any).isRequired,
};

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Utilities } from 'utils/utilities';
import 'firebase/auth';
import 'firebase/database';

export class HistoryFragment extends Component {
  constructor() {
    super();
    this.state = {
      listenHistory: [],
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
    let listenHistory = [];
    if (userSettings.listenHistory) {
      listenHistory = userSettings.listenHistory;
    }
    this.setState({ listenHistory });
  }

  handleFavorite(event, song) {
    event.preventDefault();
    event.stopPropagation();
    console.log('fave', song.title);
  }

  handlePlayPause(event, song) {
    console.log('play', song.title);
  }

  render() {
    const { listenHistory } = this.state;
    return (
      <>
        <div style={{ display: listenHistory.length ? 'none' : undefined }}>
          Loading...
        </div>
        <table style={{ display: listenHistory.length ? undefined : 'none' }}>
          <tbody>
            {
              listenHistory.map((song) => {
                const songName = Utilities.getTrueSongName(song.title, song.artist);
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
                    </td>
                    <td>
                      <span
                        className="material-icons"
                        onClick={(event) => this.handleFavorite(event, song)}
                        onKeyPress={(event) => this.handleFavorite(event, song)}
                        role="button"
                        tabIndex={0}
                      >
                        favorite_outline
                      </span>
                    </td>
                    <td>
                      <span className="material-icons">play_circle_outline</span>
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

HistoryFragment.propTypes = {
  authUser: PropTypes.objectOf(PropTypes.any).isRequired,
  database: PropTypes.objectOf(PropTypes.any).isRequired,
};

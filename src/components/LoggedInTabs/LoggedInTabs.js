import React from 'react';
import PropTypes from 'prop-types';
import { TabbedContainer } from 'components/TabbedContainer';
import { AboutFragment } from 'fragments/AboutFragment';
import { FavoritesFragment } from 'fragments/FavoritesFragment';
import { HistoryFragment } from 'fragments/HistoryFragment';
import { SettingsFragment } from 'fragments/SettingsFragment';

export const LoggedInTabs = (props) => {
  const {
    authUser, database, isSongPlaying, onPlayPauseSong, selectedTabId, song,
  } = props;

  return (
    <TabbedContainer selectedTabId={selectedTabId}>
      <FavoritesFragment
        authUser={authUser}
        database={database}
        display="Favorites"
        id="favorites"
        isSongPlaying={isSongPlaying}
        onPlayPauseSong={onPlayPauseSong}
        song={song}
      />
      <HistoryFragment
        authUser={authUser}
        database={database}
        display="History"
        song={song}
        id="history"
        isSongPlaying={isSongPlaying}
        onPlayPauseSong={onPlayPauseSong}
      />
      <SettingsFragment
        display="Settings"
        id="settings"
      />
      <AboutFragment
        display="About"
        id="about"
      />
    </TabbedContainer>
  );
};

LoggedInTabs.propTypes = {
  authUser: PropTypes.objectOf(PropTypes.any).isRequired,
  database: PropTypes.objectOf(PropTypes.any).isRequired,
  isSongPlaying: PropTypes.bool.isRequired,
  onPlayPauseSong: PropTypes.func.isRequired,
  selectedTabId: PropTypes.string.isRequired,
  song: PropTypes.objectOf(PropTypes.any).isRequired,
};

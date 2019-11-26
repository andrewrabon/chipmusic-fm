import React from 'react';
import PropTypes from 'prop-types';
import { TabbedContainer } from 'components/TabbedContainer';
import { AboutFragment } from 'fragments/AboutFragment';
import { FavoritesFragment } from 'fragments/FavoritesFragment';
import { HistoryFragment } from 'fragments/HistoryFragment';
import { SettingsFragment } from 'fragments/SettingsFragment';

export const LoggedInTabs = (props) => {
  const {
    authUser, database, isSongPlaying, selectedTabId, song,
  } = props;

  const accountTabs = [
    {
      id: 'favorites',
      display: 'Favorites',
      child: (
        <FavoritesFragment
          authUser={authUser}
          database={database}
          song={song}
          isSongPlaying={isSongPlaying}
        />
      ),
    }, {
      id: 'history',
      display: 'History',
      child: (
        <HistoryFragment
          authUser={authUser}
          database={database}
          song={song}
          isSongPlaying={isSongPlaying}
        />
      ),
    }, {
      id: 'settings',
      display: 'Settings',
      child: (
        <SettingsFragment />
      ),
    }, {
      id: 'about',
      display: 'About',
      child: <AboutFragment />,
    },
  ];
  return (
    <TabbedContainer
      tabs={accountTabs}
      selectedTabId={selectedTabId}
    />
  );
};

LoggedInTabs.propTypes = {
  authUser: PropTypes.objectOf(PropTypes.any).isRequired,
  database: PropTypes.objectOf(PropTypes.any).isRequired,
  isSongPlaying: PropTypes.bool.isRequired,
  selectedTabId: PropTypes.string.isRequired,
  song: PropTypes.objectOf(PropTypes.any).isRequired,
};

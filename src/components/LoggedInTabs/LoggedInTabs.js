import React from 'react';
import PropTypes from 'prop-types';
import { TabbedContainer } from 'components/TabbedContainer';
import { AboutFragment } from 'fragments/AboutFragment';
import { FavoritesFragment } from 'fragments/FavoritesFragment';

export const LoggedInTabs = (props) => {
  const { isSongPlaying, selectedTabId, song } = props;

  const accountTabs = [
    {
      id: 'favorites',
      display: 'Favorites',
      child: (<FavoritesFragment
        song={song}
        isSongPlaying={isSongPlaying}
      />),
    }, {
      id: 'history',
      display: 'History',
      child: (<div>History</div>),
    }, {
      id: 'settings',
      display: 'Settings',
      child: (<div>Coming soon.</div>),
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
  isSongPlaying: PropTypes.bool.isRequired,
  selectedTabId: PropTypes.string.isRequired,
  song: PropTypes.objectOf(PropTypes.any).isRequired,
};

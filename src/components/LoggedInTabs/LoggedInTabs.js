import React from 'react';
import PropTypes from 'prop-types';
import { TabbedContainer } from 'components/TabbedContainer';
import { AboutFragment } from 'fragments/AboutFragment';

const ACCOUNT_TABS = [
  {
    id: 'favorites',
    display: 'Favorites',
    child: (<div>Favorites</div>),
  }, {
    id: 'history',
    display: 'History',
    child: (<div>History</div>),
  }, {
    id: 'settings',
    display: 'Settings',
    child: (<div>Settings</div>),
  }, {
    id: 'about',
    display: 'About',
    child: <AboutFragment />,
  },
];

export const LoggedInTabs = (props) => {
  const { selectedTabId } = props;
  return (
    <TabbedContainer tabs={ACCOUNT_TABS} selectedTabId={selectedTabId} />
  );
};

LoggedInTabs.propTypes = {
  selectedTabId: PropTypes.string.isRequired,
};

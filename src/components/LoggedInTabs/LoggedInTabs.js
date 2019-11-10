import React from 'react';
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

export const LoggedInTabs = () => (
  <TabbedContainer tabs={ACCOUNT_TABS} />
);

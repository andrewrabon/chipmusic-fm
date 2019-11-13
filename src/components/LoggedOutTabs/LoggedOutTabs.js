import React from 'react';
import PropTypes from 'prop-types';
import { TabbedContainer } from 'components/TabbedContainer';
import { AboutFragment } from 'fragments/AboutFragment';
import { LoginFragment } from 'fragments/LoginFragment';
import { RegisterFragment } from 'fragments/RegisterFragment';

const LOGIN_TABS = [
  {
    id: 'login',
    display: 'Login',
    child: <LoginFragment />,
  }, {
    id: 'register',
    display: 'Register',
    child: <RegisterFragment />,
  }, {
    id: 'about',
    display: 'About',
    child: <AboutFragment />,
  },
];

export const LoggedOutTabs = (props) => {
  const { selectedTabId } = props;
  return (
    <TabbedContainer tabs={LOGIN_TABS} selectedTabId={selectedTabId} />
  );
};

LoggedOutTabs.propTypes = {
  selectedTabId: PropTypes.string.isRequired,
};

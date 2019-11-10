import React from 'react';
import { TabbedContainer } from 'components/TabbedContainer';
import { LoginFragment } from './components/LoginFragment';

const LOGIN_TABS = [
  {
    id: 'login',
    display: 'Login',
    child: (<LoginFragment />),
  }, {
    id: 'register',
    display: 'Register',
    child: (<div>Register</div>),
  }, {
    id: 'about',
    display: 'About',
    child: (<div>About</div>),
  },
];

export const LoggedOutTabs = () => (
  <TabbedContainer tabs={LOGIN_TABS} />
);

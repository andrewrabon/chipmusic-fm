import React from 'react';
import { TabbedContainer } from 'components/TabbedContainer';

const LOGIN_TABS = [
  {
    id: 'login',
    display: 'Login',
    child: (<div>Login</div>),
  }, {
    id: 'register',
    display: 'Register',
    child: (<div>Register</div>),
  },
];

export const LoggedOutTabs = () => (
  <TabbedContainer tabs={LOGIN_TABS} />
);

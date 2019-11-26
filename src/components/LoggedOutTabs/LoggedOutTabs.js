import React from 'react';
import PropTypes from 'prop-types';
import { TabbedContainer } from 'components/TabbedContainer';
import { AboutFragment } from 'fragments/AboutFragment';
import { LoginFragment } from 'fragments/LoginFragment';
import { RegisterFragment } from 'fragments/RegisterFragment';

export const LoggedOutTabs = (props) => {
  const { selectedTabId } = props;
  return (
    <TabbedContainer selectedTabId={selectedTabId}>
      <LoginFragment
        display="Login"
        id="login"
      />
      <RegisterFragment
        display="Register"
        id="register"
      />
      <AboutFragment
        display="About"
        id="about"
      />
    </TabbedContainer>
  );
};

LoggedOutTabs.propTypes = {
  selectedTabId: PropTypes.string.isRequired,
};

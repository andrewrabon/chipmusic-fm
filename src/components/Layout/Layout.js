import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { App } from 'components/App';
import {
  AuthUserContext, FirebaseContext, getFirebase, withAuthentication,
} from 'components/Firebase';
import { SEO } from 'components/SEO';

const AppWithAuthentication = withAuthentication((props) => {
  const {
    title,
    pageId,
  } = props;
  return (
    <AuthUserContext.Consumer>
      {(authUser) => (
        <>
          <SEO title={title} />
          <App pageId={pageId} authUser={authUser} {...props} />
        </>
      )}
    </AuthUserContext.Consumer>
  );
});

export const Layout = (props) => (
  <FirebaseContext.Provider value={getFirebase(firebase)}>
    <AppWithAuthentication {...props} />
  </FirebaseContext.Provider>
);

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  pageId: PropTypes.string.isRequired,
};

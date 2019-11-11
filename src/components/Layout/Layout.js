import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import { App } from 'components/App';
import { getFirebase, withAuthentication, FirebaseContext } from 'components/Firebase';
import { SEO } from 'components/SEO';

const AppWithAuthentication = withAuthentication((props) => {
  const {
    title,
    pageId,
  } = props;
  return (
    <>
      <SEO title={title} />
      <App pageId={pageId} {...props} />
    </>
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

import React from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import { App } from 'components/App';
import { getFirebase, withAuthentication, FirebaseContext } from 'components/Firebase';
import { SEO } from 'components/SEO';

const ComponentWithAuthentication = withAuthentication(({ children }) => (
  <>
    {children}
  </>
));

export const Layout = (props) => {
  const {
    title,
    pageId,
  } = props;
  return (
    <FirebaseContext.Provider value={getFirebase(firebase)}>
      <ComponentWithAuthentication>
        <SEO title={title} />
        <App pageId={pageId} />
      </ComponentWithAuthentication>
    </FirebaseContext.Provider>
  );
};

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  pageId: PropTypes.string.isRequired,
};

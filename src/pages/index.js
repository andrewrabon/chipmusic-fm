import React from 'react';
import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import { App } from 'components/App';
import { getFirebase, FirebaseContext } from 'components/Firebase';
import { SEO } from 'components/SEO';

const Index = () => (
  <FirebaseContext.Provider value={getFirebase(firebase)}>
    <SEO title="Home" />
    <App pageId="index" />
  </FirebaseContext.Provider>
);

export { Index };

// This file needs to export a default for Gatsby to work.
/* eslint import/no-default-export: [0] */
export default Index;

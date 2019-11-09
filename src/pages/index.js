import React from 'react';
import { App } from 'components/App';
import { Firebase, FirebaseContext } from 'components/Firebase';
import { SEO } from 'components/SEO';

const Index = () => (
  <FirebaseContext.Provider value={new Firebase()}>
    <SEO title="Home" />
    <App pageId="index" />
  </FirebaseContext.Provider>
);

export { Index };

// This file needs to export a default for Gatsby to work.
/* eslint import/no-default-export: [0] */
export default Index;

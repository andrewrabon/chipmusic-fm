import React from 'react';
import { App } from 'components/App';
import { SEO } from 'components/SEO';

const Favorites = () => (
  <>
    <SEO title="Favorites" />
    <App pageId="favorites" />
  </>
);

export { Favorites };

// This file needs to export a default for Gatsby to work.
/* eslint import/no-default-export: [0] */
export default Favorites;

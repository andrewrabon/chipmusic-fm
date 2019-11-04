import React from 'react';
import { App } from 'components/App';
import { SEO } from 'components/SEO';

const Index = () => (
  <>
    <SEO title="Home" />
    <App page="index" />
  </>
);

export { Index };

// This file needs to export a default for Gatsby to work.
/* eslint import/no-default-export: [0] */
export default Index;

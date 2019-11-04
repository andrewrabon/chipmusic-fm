import React from 'react';
import { App } from 'components/App';
import { SEO } from 'components/SEO';

const Settings = () => (
  <>
    <SEO title="Settings" />
    <App pageId="settings" />
  </>
);

export { Settings };

// This file needs to export a default for Gatsby to work.
/* eslint import/no-default-export: [0] */
export default Settings;

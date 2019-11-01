import React from 'react';

import { Layout } from '../components/layout';
import { SEO } from '../components/seo';

const SettingsPage = () => (
  <Layout>
    <SEO title="Settings" />
    <article className="page">
      <ul className="page__tabs">
        <li className="page-tab--selected"><a href="/settings">Settings</a></li>
        <li><a href="/likes">Likes</a></li>
        <li><a href="/history">History</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      <div className="page__content">
        Hello, world.
      </div>
    </article>
  </Layout>
);

export { SettingsPage };

// This file needs to export a default for Gatsby to work.
/* eslint import/no-default-export: [0] */
export default SettingsPage;

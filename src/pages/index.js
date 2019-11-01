import React from 'react';
import { Link } from 'gatsby';

import { Layout } from '../components/layout';
import { SEO } from '../components/seo';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <article className="song">
      <a href="/#" className="song__credits">
        <h1>Artist</h1>
        <h2>&ldquo;Song&rdquo;</h2>
        <h3>1 play &middot; 0 likes</h3>
      </a>
    </article>
  </Layout>
);

export { IndexPage };

// This file needs to export a default for Gatsby to work.
/* eslint import/no-default-export: [0] */
export default IndexPage;

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, Link } from 'gatsby';

import './layout.css';

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <main>
        {children}
      </main>
      <div className="player">
        <input className="player__scrubber" type="range" min="0" value="0" step="0.01" disabled />
        <a href="/#" className="player__control" target="_blank" download>
          <span className="material-icons">cloud_download</span>
        </a>
        <button className="player__control" type="button">
          <span className="material-icons">skip_previous</span>
        </button>
        <button className="player__control" type="button">
          <span className="material-icons">play_circle_filled</span>
        </button>
        <button className="player__control" type="button">
          <span className="material-icons">skip_next</span>
        </button>
        <button className="player__control" type="button">
          <span className="material-icons">favorite_border</span>
        </button>
      </div>
      <Link to="/settings" className="utility-button">
        <span className="material-icons">account_circle</span>
      </Link>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Layout };

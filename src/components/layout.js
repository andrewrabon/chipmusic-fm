/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

import "./layout.css"

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <main>
        {children}
      </main>
      <div class="player">
        <input class="player__scrubber" type="range" min="0" value="0" step="0.01" disabled />
        <a href="#" class="player__control" target="_blank" download>
          <span class="material-icons">cloud_download</span>
        </a>
        <button class="player__control">
          <span class="material-icons">skip_previous</span>
        </button>
        <button class="player__control">
          <span class="material-icons">play_circle_filled</span>
        </button>
        <button class="player__control">
          <span class="material-icons">skip_next</span>
        </button>
        <button class="player__control">
          <span class="material-icons">favorite_border</span>
        </button>
      </div>
      <a href="/settings" class="utility-button">
        <span class="material-icons">settings</span>
      </a>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout

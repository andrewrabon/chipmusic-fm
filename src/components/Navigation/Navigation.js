import React, { Component } from 'react';
import { Link } from 'gatsby';

import './Navigation.css';

class Navigation extends Component {
  render() {
    const {
      glyph,
      link,
      onClick,
    } = this.props;

    return (
      <Link to={link} className="navigation-button" onClick={onClick}>
        <span className="material-icons">{glyph}</span>
      </Link>
    );
  }
}

export { Navigation };

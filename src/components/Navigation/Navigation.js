import React, { Component } from 'react';
import { Link } from 'gatsby';

import './Navigation.css';

class Navigation extends Component {
  render() {
    const {
      glyph,
      hasInvertedColors,
      link,
      onClick,
    } = this.props;

    const invertedClassName = hasInvertedColors ? 'navigation-button--inverted' : '';

    return (
      <Link to={link} className={`navigation-button ${invertedClassName}`} onClick={onClick}>
        <span className="material-icons">{glyph}</span>
      </Link>
    );
  }
}

export { Navigation };

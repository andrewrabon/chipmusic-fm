import React, { Component } from 'react';
import { Link } from 'gatsby';

import './Navigation.css';

class Navigation extends Component {
  constructor() {
    super();
    this.state = {
      glyph: 'account_circle',
      link: '/login',
    };
  }

  render() {
    const {
      glyph,
      link,
    } = this.state;

    return (
      <Link to={link} className="navigation-button">
        <span className="material-icons">{glyph}</span>
      </Link>
    );
  }
}

export { Navigation };

import React from 'react';
import PropTypes from 'prop-types';
import './NavigationButton.css';

export const NavigationButton = (props) => {
  const {
    glyph,
    hasInvertedColors,
    onClick,
    style,
  } = props;
  const invertedClassName = hasInvertedColors ? 'navigation-button--inverted' : '';

  return (
    <button
      className={`navigation-button ${invertedClassName}`}
      onClick={onClick}
      style={style}
      type="button"
    >
      <span className="material-icons">{glyph}</span>
    </button>
  );
};

NavigationButton.propTypes = {
  glyph: PropTypes.string.isRequired,
  hasInvertedColors: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

NavigationButton.defaultProps = {
  style: {},
};

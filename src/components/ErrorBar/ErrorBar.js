import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './ErrorBar.css';

export const ErrorBar = ({ message, isVisible }) => {
  const [visibilityState, setVisibilityState] = useState(isVisible);
  const visibilityStyles = visibilityState ? { transform: 'translate(0, 0)' } : undefined;
  const handleDismiss = () => {
    setVisibilityState(false);
  };
  return (
    <div className="error-bar" style={visibilityStyles}>
      {message}
      <button
        className="error-bar__dismiss-button"
        onClick={handleDismiss}
        title="Dismiss this error notification"
        type="button"
      >
        <span className="material-icons">highlight_off</span>
      </button>
      <a
        className="error-bar__bug-report-button"
        href="https://github.com/andrewrabon/chipmusic-fm/issues"
        rel="noopener noreferrer"
        target="_blank"
        title="Find help or file a new bug report"
      >
        <span className="material-icons">bug_report</span>
      </a>
    </div>
  );
};

ErrorBar.propTypes = {
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
};

ErrorBar.defaultProps = {
  isVisible: false,
};

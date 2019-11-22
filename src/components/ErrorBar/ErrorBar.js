import React from 'react';
import PropTypes from 'prop-types';
import './ErrorBar.css';

export const ErrorBar = ({ message, isVisible, onDismiss }) => {
  const visibilityStyles = isVisible ? { transform: 'translate(0, 0)' } : undefined;
  return (
    <div
      className="error-bar"
      style={visibilityStyles}
    >
      <div style={{ display: isVisible ? undefined : 'none' }}>
        {message}
        <button
          className="error-bar__dismiss-button"
          onClick={onDismiss}
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
    </div>
  );
};

ErrorBar.propTypes = {
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
  onDismiss: PropTypes.func.isRequired,
};

ErrorBar.defaultProps = {
  isVisible: false,
};

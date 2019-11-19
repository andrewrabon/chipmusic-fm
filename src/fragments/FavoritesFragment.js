import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from 'components/Firebase';

const FavoritesFragment = (props) => {
  const { firebase } = props;
  return (
    <table>
      <tbody>
        <tr>
          <td>
            <strong>When I Sleep, My Heart Speaks</strong>
            {' '}
            &middot; IAYD
          </td>
          <td>
            <span className="material-icons">play_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
        <tr className="selected-row">
          <td>
            <strong>Triwing Madness!</strong>
            {' '}
            &middot; Hell-O Bit!
          </td>
          <td>
            <span className="material-icons">pause_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
        <tr>
          <td>
            <strong>unclassified</strong>
            {' '}
            &middot; mikrobotmen
          </td>
          <td>
            <span className="material-icons">play_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
        <tr>
          <td>
            <strong>No Man&apos;s Land</strong>
            {' '}
            &middot; Dj RoboRob
          </td>
          <td>
            <span className="material-icons">play_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
        <tr>
          <td>
            <strong>Air</strong>
            {' '}
            &middot; Adventures in Slumberland
          </td>
          <td>
            <span className="material-icons">play_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

FavoritesFragment.propTypes = {
  firebase: PropTypes.objectOf(PropTypes.any).isRequired,
};

const FavoritesWithFirebase = withFirebase(FavoritesFragment);

export { FavoritesWithFirebase as FavoritesFragment };

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from 'components/Firebase';

const FavoritesFragment = (props) => {
  const { firebase } = props;
  return (
    <table>
      <tbody>
        <tr>
          <td>&ldquo;When I Sleep, My Heart Speaks&rdquo; by IAYD</td>
          <td>
            <span className="material-icons">play_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
        <tr className="selected-row">
          <td>&ldquo;Triwing Madness!&rdquo; by Hell-O Bit!</td>
          <td>
            <span className="material-icons">pause_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
        <tr>
          <td>&ldquo;unclassified&rdquo; by mikrobotmen</td>
          <td>
            <span className="material-icons">play_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
        <tr>
          <td>&ldquo;No Man&apos;s Land&rdquo; by Dj RoboRob</td>
          <td>
            <span className="material-icons">play_circle_outline</span>
            <span className="material-icons">favorite_filled</span>
          </td>
        </tr>
        <tr>
          <td>&ldquo;Air&rdquo; by Adventures in Slumberland</td>
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

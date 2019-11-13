import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from 'components/Firebase';

const FavoritesFragment = (props) => {
  const { firebase } = props;
  return (
    <>
      Hello, world.
    </>
  );
};

FavoritesFragment.propTypes = {
  firebase: PropTypes.objectOf(PropTypes.any).isRequired,
};

const FavoritesWithFirebase = withFirebase(FavoritesFragment);

export { FavoritesWithFirebase as FavoritesFragment };

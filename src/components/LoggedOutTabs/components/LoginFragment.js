import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from 'components/Firebase';
import { logger } from 'utils/logger';

const LoginFragment = (props) => {
  const { firebase } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const submit = (event) => {
    event.preventDefault();
    firebase.doSignInWithEmailAndPassword(email, password)
      .catch(() => logger.error('Invalid email or password'));
  };
  return (
    <form onSubmit={submit}>
      <input
        name="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        name="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="button" onClick={submit}>Login</button>
    </form>
  );
};

LoginFragment.propTypes = {
  firebase: PropTypes.objectOf(PropTypes.any).isRequired,
};

const LoginWithFirebase = withFirebase(LoginFragment);

export { LoginWithFirebase as LoginFragment };

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
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        required
        type="email"
        value={email}
      />
      <input
        name="password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
        type="password"
        value={password}
      />
      <button type="submit" onClick={submit}>Login</button>
    </form>
  );
};

LoginFragment.propTypes = {
  firebase: PropTypes.objectOf(PropTypes.any).isRequired,
};

const LoginWithFirebase = withFirebase(LoginFragment);

export { LoginWithFirebase as LoginFragment };

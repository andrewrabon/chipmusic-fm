import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withFirebase } from 'components/Firebase';
import { logger } from 'utils/logger';

const RegisterFragment = (props) => {
  const { firebase } = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const submit = (event) => {
    event.preventDefault();
    if (password !== passwordConfirmation) {
      setHasPasswordError(true);
      return;
    }
    setHasPasswordError(false);
    firebase.doCreateUserWithEmailAndPassword(email, password)
      .catch(() => logger.error('Invalid email or password'));
  };
  const passwordClassName = hasPasswordError ? 'input-error' : '';
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
        className={passwordClassName}
        name="password"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Password"
        required
        type="password"
        value={password}
      />
      <input
        className={passwordClassName}
        name="passwordConfirmation"
        onChange={(event) => setPasswordConfirmation(event.target.value)}
        placeholder="Password, again"
        required
        type="password"
        value={passwordConfirmation}
      />
      <button type="submit" onClick={submit}>Register</button>
    </form>
  );
};

RegisterFragment.propTypes = {
  firebase: PropTypes.objectOf(PropTypes.any).isRequired,
};

const RegisterWithFirebase = withFirebase(RegisterFragment);

export { RegisterWithFirebase as RegisterFragment };

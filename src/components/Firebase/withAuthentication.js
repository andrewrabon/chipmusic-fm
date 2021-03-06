import React from 'react';
import PropTypes from 'prop-types';
import { AuthUserContext } from './AuthUserContext';
import { withFirebase } from './FirebaseContext';

export const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        hasFirebaseInitialized: false,
      };
    }

    componentDidMount() {
      this.setState({
        authUser: JSON.parse(localStorage.getItem('authUser')),
      });

      this.firebaseInit();
    }

    componentDidUpdate() {
      this.firebaseInit();
    }

    componentWillUnmount() {
      if (this.listener) {
        this.listener();
      }
    }

    firebaseInit() {
      const { firebase } = this.props;
      const { hasFirebaseInitialized } = this.state;
      if (firebase && !hasFirebaseInitialized) {
        this.setState({
          hasFirebaseInitialized: true,
        });

        this.listener = firebase.auth.onAuthStateChanged(
          (authUser) => {
            localStorage.setItem(
              'authUser',
              JSON.stringify(authUser),
            );
            this.setState({ authUser });
          },
        );
      }
    }

    render() {
      const { authUser } = this.state;
      return (
        <AuthUserContext.Provider value={authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  WithAuthentication.propTypes = {
    firebase: PropTypes.objectOf(PropTypes.any).isRequired,
  };

  return withFirebase(WithAuthentication);
};

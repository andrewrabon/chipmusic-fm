import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

export const SettingsFragment = () => (
  <form>
    <button type="button" onClick={() => firebase.auth().signOut()}>Logout</button>
  </form>
);

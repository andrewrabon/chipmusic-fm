import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';

export const SettingsFragment = () => (
  <form>
    <p>More settings are coming soon.</p>
    <button type="button" onClick={() => firebase.auth().signOut()}>Logout</button>
  </form>
);

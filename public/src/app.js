import { AboutDialog } from './components/AboutDialog.js';
import { HistoryDialog } from './components/HistoryDialog.js';
import { LikesDialog } from './components/LikesDialog.js';
import { LoginDialog } from './components/LoginDialog.js';
import { LogoutDialog } from './components/LogoutDialog.js';
import { RegisterDialog } from './components/RegisterDialog.js';
import { SettingsDialog } from './components/SettingsDialog.js';
import { ConcretePopover } from '../../node_modules/concrete-elements/src/elements/ConcretePopover.js';
import { HomeScreen } from './components/HomeScreen.js';

let user = firebase.auth().currentUser;

const userButton = document.getElementById('user-button');
userButton.addEventListener('click', (event) => {
  event.stopPropagation();
  let popoverItems = [
    {
      title: 'Login',
      onClick: () => new LoginDialog(),
    }, {
      title: 'Register',
      onClick: () => new RegisterDialog(),
    }, {
      title: 'About',
      onClick: () => new AboutDialog(),
    },
  ];

  if (user) {
    popoverItems = [
      {
        title: 'Likes',
        onClick: () => new LikesDialog(),
      }, {
        title: 'History',
        onClick: () => new HistoryDialog(),
      }, {
        title: 'Settings',
        onClick: () => new SettingsDialog(),
      }, {
        title: 'About',
        onClick: () => new AboutDialog(),
      }, {
        title: 'Logout',
        onClick: () => new LogoutDialog(),
      },
    ];
  }
  userButton.after(new ConcretePopover({
    items: popoverItems,
  }));
});

// Checks the user's login info.
firebase.auth().onAuthStateChanged(changedUser => {
  if (changedUser) {
    user = changedUser;
  } else {
    user = firebase.auth().currentUser;
  }
});

document.querySelector('main').appendChild(new HomeScreen());
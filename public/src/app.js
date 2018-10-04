import { Navigator } from './components/Navigator.js';
import { HistoryDialog } from './components/HistoryDialog';
import { LikesDialog } from './components/LikesDialog';
import { SettingsDialog } from './components/SettingsDialog';
import { ConcretePopover } from '../../node_modules/concrete-elements/src/elements/ConcretePopover.js';

const navigateToAppropriateScreen = () => {
  const urlParts = window.location.pathname.split('/');
  if (urlParts[1] === '') {
    Navigator.navigateToScreen('home');
  } else {
    Navigator.navigateToScreen(urlParts[1], urlParts[2]);
  }
};

window.onpopstate = (event) => {
  event.preventDefault();
  event.stopPropagation();
  navigateToAppropriateScreen();
};

const userButton = document.getElementById('user-button');
userButton.addEventListener('click', (event) => {
  event.stopPropagation();
  const userPopover = new ConcretePopover({
    items: [
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
        title: 'Logout',
        onClick: () => Navigator.navigateToScreen('logout'),
      },
    ],
  });
  userButton.after(userPopover);
});

navigateToAppropriateScreen();

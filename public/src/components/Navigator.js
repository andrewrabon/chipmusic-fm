import { HomeScreen } from './HomeScreen.js';
import { ConcreteNavigator } from '../../../node_modules/concrete-elements/src/helpers/ConcreteNavigator.js';

export class Navigator extends ConcreteNavigator {
  static navigateToScreen(screenName, resourceId) {
    super.navigateToScreen(screenName, resourceId);
    document.getElementById('back-button').style.visibility = screenName !== 'home' ? 'visible' : 'hidden';
  }

  static getScreen() {
    return new HomeScreen();
  }
}

import { ConcreteButton } from  '../../../node_modules/concrete-elements/src/elements/ConcreteButton.js';
import { ConcreteDialog } from  '../../../node_modules/concrete-elements/src/elements/ConcreteDialog.js';

export class LogoutDialog extends ConcreteDialog {
  async connectedCallback() {
    this.innerHTML = `
      <dialog>
        <article>
          <h1>
            Logout
            <button class="dialog-close-button"><i class="material-icons">close</i></button>
          </h1>
          <p style="margin-bottom: 1rem;">Are you sure you want to logout?</p>
          <concrete-button class="logout-dialog__submit">Logout</concrete-button>
        </article>
      </dialog>
    `;

    this.querySelector('.logout-dialog__submit').addEventListener('click', () => {
      firebase.auth().signOut();
    });
  }
}

window.customElements.define('logout-dialog', LogoutDialog);

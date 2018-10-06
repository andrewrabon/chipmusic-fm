import { ConcreteButton } from  '../../../node_modules/concrete-elements/src/elements/ConcreteButton.js';
import { ConcreteDialog } from  '../../../node_modules/concrete-elements/src/elements/ConcreteDialog.js';
import { RegisterDialog } from './RegisterDialog.js';

export class LoginDialog extends ConcreteDialog {
  async connectedCallback() {
    this.innerHTML = `
      <dialog>
        <article>
          <h1>
            Login
            <button class="dialog-close-button"><i class="material-icons">close</i></button>
          </h1>
          <form class="login-dialog__form">
            <input name="email" type="email" placeholder="Enter your email address">
            <input name="password" type="password" placeholder="Enter your password">
            <concrete-button class="login-dialog__submit">Login</concrete-button>
            <a href="#" class="login-register-link">Don't have an account? Register here.</a>
          </form>
        </article>
      </dialog>
    `;

    this.querySelector('.login-dialog__form').addEventListener('submit', () => {
      const email = this.querySelector('[name=email]').value;
      const password = this.querySelector('[name=password]').value;
      const button = this.querySelector('.login-dialog__submit');
      button.loading = true;
      button.disabled = true;

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          this.close();
        })
        .catch((error) => {
          console.error(error);
          button.loading = false;
          button.disabled = false;
          // TODO: Error handling.
        });
    });

    this.querySelector('.login-register-link').addEventListener('click', (event) => {
      event.preventDefault();
      new RegisterDialog();
      this.close();
    });
  }
}

window.customElements.define('login-dialog', LoginDialog);

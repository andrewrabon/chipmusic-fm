import { ConcreteButton } from  '../../../node_modules/concrete-elements/src/elements/ConcreteButton.js';
import { ConcreteDialog } from  '../../../node_modules/concrete-elements/src/elements/ConcreteDialog.js';
import { LoginDialog } from './LoginDialog.js';

export class RegisterDialog extends ConcreteDialog {
  async connectedCallback() {
    this.innerHTML = `
      <dialog>
        <article>
          <h1>
            Register
            <button class="dialog-close-button"><i class="material-icons">close</i></button>
          </h1>
          <form class="register-dialog__form">
            <input name="email" type="email" placeholder="Enter your email address">
            <input name="email-confirm" type="email" placeholder="Re-enter your email address">
            <input name="password" type="password" placeholder="Enter your password">
            <concrete-button class="register-dialog__submit">Register</concrete-button>
            <a href="#" class="login-register-link">Already have an account? Login here.</a>
          </form>
        </article>
      </dialog>
    `;

    this.querySelector('.register-dialog__form').addEventListener('submit', () => {
      const email = this.querySelector('[name=email]').value;
      const emailConfirm = this.querySelector('[name=email-confirm]').value;
      const password = this.querySelector('[name=password]').value;
      const button = this.querySelector('.register-dialog__submit');
      button.loading = true;
      button.disabled = true;

      firebase.auth().createUserWithEmailAndPassword(email, password)
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
      new LoginDialog();
      this.close();
    });
  }
}

window.customElements.define('register-dialog', RegisterDialog);

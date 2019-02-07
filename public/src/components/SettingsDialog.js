import { ConcreteDialog } from '../../../node_modules/concrete-elements/src/elements/ConcreteDialog.js';

export class SettingsDialog extends ConcreteDialog {
  async connectedCallback() {
    this.innerHTML = `
      <dialog>
        <article>
          <h1>
            Settings
            <button class="dialog-close-button"><i class="material-icons">close</i></button>
          </h1>
          <div class="dialog-content">
            <p>Aren't dialogs cool? 🦄</p>
          </div>
        </article>
      </dialog>
    `;
  }
}

window.customElements.define('settings-dialog', SettingsDialog);

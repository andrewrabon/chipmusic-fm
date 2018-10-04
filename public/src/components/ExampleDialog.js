import { ConcreteDialog } from '../../../node_modules/concrete-elements/src/elements/ConcreteDialog.js';

export class ExampleDialog extends ConcreteDialog {
  /**
   * When this custom element is inserted into the DOM and instantiated, we'll fill out its markup
   * here.
   */
  connectedCallback() {
    this.innerHTML = `
      <dialog>
        <article>
          <h1>
            Example Dialog
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

window.customElements.define('example-dialog', ExampleDialog);

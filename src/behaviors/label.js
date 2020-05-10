import Behavior from './behavior';
import { enableFocus } from '../focus';

export default class LabelBehavior extends Behavior {
  init() {
    this.host.addEventListener('click', () => {
      const id = this.host.id;

      if (!id) return;

      const element = document.querySelector(`[aria-labelledby="${id}"]`);

      if (element) {
        element.click();
        element.focus();

        enableFocus();
      }
    });
  }
}

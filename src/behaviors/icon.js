import Behavior from './behavior';
import { parseAllValues, svgElement } from '../helpers';
import Icons from '../icons';

export default class IconBehavior extends Behavior {
  connected() {
    this.$host.nuSetAria('hidden', true);

    this.apply();
  }

  changed(name) {
    if (!this.isConnected) return;

    if (name === 'name') {
      this.apply();
    }
  }

  apply() {
    const { $host } = this;

    const value = this.$host.nuGetAttr('name');

    // empty tag
    this.innerHTML = '';

    if (!value) return;

    const names = parseAllValues(value);

    names.forEach(name => {
      if ($host.querySelector(`svg[name="${name}"]`)) return;

      Icons.load(name).then(svg => {
        const svgNode = svgElement(svg);

        svgNode.setAttribute('name', name);
        svgNode.style.opacity = '0';

        $host.appendChild(svgNode);
      });
    });
  }
}

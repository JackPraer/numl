import { toCamelCase } from '../helpers';
import WidgetBehavior from './widget';
import Components from '../components/index';

export default class ComponentBehavior extends WidgetBehavior {
  static get params() {
    return {
      input: true,
      localized: true,
      primary: true,
      provider: false,
    };
  }

  constructor(host, params) {
    // use first part of params (string) as name of component
    const tmp = params.split(/\s+/);
    const name = tmp[0];

    super(host, tmp[1]);

    const loader = Components[name];

    if (loader) {
      this.componentPromise = loader();
    }
  }

  init() {
    super.init();

    const { host } = this;

    if (!host.hasAttribute('type')) {
      host.setAttribute('type', 'date');
    }

    this.componentPromise
      .then(Component => {
        const target = this.isShadowAllowed
          ? host.attachShadow({ mode: 'open' }) : host;

        this.Component = Component;

        this.component = new Component({
          target,
          props: this.componentProps,
        });

        this.component.$on('input', (event) => {
          this.emit('input', event.detail);
          this.doAction(event.detail, 'input');
        });
      });
  }

  get componentProps() {
    const prototype = this.Component.prototype;

    const props = [...this.propsList, 'host']
      .reduce((data, attr) => {
        if (attr === 'lang') {
          attr = 'locale';
        }

        if (attr in prototype) {
          data[toCamelCase(attr)] = this[attr];
        }

        return data;
      }, {});

    return props;
  }

  changed(name, value) {
    super.changed(name, value);

    if (name === 'lang') {
      name = 'locale';
    }

    if (this.component) {
      const prototype = this.Component.prototype;

      if (name in prototype) {
        this.set({ [name]: this[name] });
      }
    }
  }

  set(data) {
    if (typeof data === 'object' && this.component) {
      this.component.$set(data);

      return true;
    } else {
      return false;
    }
  }

  setValue(value, silent) {
    if (this.value === value) return;

    this.set({ value });

    this.value = value;

    if (!silent && this.component) {
      this.emit('input', this.value);
      this.doAction(value);
    }
  }
}

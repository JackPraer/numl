import { toCamelCase } from '../helpers';
import WidgetBehavior from './widget';
import Components from '../components/index';

export default class ComponentBehavior extends WidgetBehavior {
  static get localized() {
    return true;
  }

  static get formField() {
    return true;
  }

  constructor(host, value) {
    super(host, value);

    const loader = Components[value];

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
        const target = this.context.useShadow && host.constructor.nuAllowShadow
          ? host.attachShadow({ mode: 'open' }) : host;

        this.Component = Component;

        this.component = new Component({
          target,
          props: this.componentProps,
        });

        this.component.$on('input', (event) => {
          host.nuEmitInput(event.detail);
        });
      });
  }

  get componentProps() {
    const prototype = this.Component.prototype;

    return this.propsList
      .reduce((data, attr) => {
        if (attr === 'lang') {
          attr = 'locale';
        }

        if (attr in prototype) {
          data[toCamelCase(attr)] = this[attr];
        }

        return data;
      }, { host: this.host });
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
}

import NuGrid from './grid';
import focusable from '../mixins/focusable';
import { generateId, bindActiveEvents, setImmediate, invertQuery, colorUnit } from '../helpers';

const backgroundUnit = colorUnit('background-color', 'background');

export default class NuAbstractBtn extends NuGrid {
  static get nuTag() {
    return 'nu-abstract-btn';
  }

  static get nuRole() {
    return 'button';
  }

  static get nuAttrs() {
    return {
      disabled: '',
      pressed: '',
      href: '',
      target: '',
      controls: '',
      value: '',
      background: colorUnit('background-color', 'background'),
    };
  }

  static get nuDefaults() {
    return {
      display: 'inline-grid',
      padding: '.5x',
      color: 'inherit',
      background: '',
      radius: '',
      mod: 'nowrap',
      flow: 'column',
      content: 'center',
      gap: .5,
      transition: 'box-shadow, background, color',
    };
  }

  static nuCSS({ nuTag }) {
    return `
      ${nuTag} {
        --nu-toggle-color: transparent;
        --nu-depth-color: transparent;
        --nu-hover-color: transparent;
        --nu-depth-shadow: 0 0 0 rgba(0, 0, 0, 0);

        position: relative;
        user-select: none;
        vertical-align: middle;
        opacity: 1;
        z-index: 0; /* to make :hover::after z-index work as expected */
        background-image: linear-gradient(to right, var(--nu-hover-color), var(--nu-hover-color));
      }

      ${nuTag}[tabindex] {
        cursor: pointer;
      }

      ${nuTag}[disabled] {
        opacity: .5;
        cursor: default;
      }

      ${nuTag}[nu-active] {
        z-index: 2;
      }

      ${nuTag}[aria-pressed="true"] {
        z-index: 1;
      }

      ${focusable(nuTag)}
    `;
  }

  nuConnected() {
    super.nuConnected();

    if (!this.hasAttribute('pressed')) {
      this.nuSetValue(false);
    }

    this.nuSetFocusable(!this.hasAttribute('disabled'));

    bindActiveEvents.call(this);

    setTimeout(() => {
      if (!this.parentNode) return;

      switch (this.parentNode.tagName) {
        case 'NU-BTN-GROUP':
          if (this.parentNode.nuGetValue()) {
            this.setAttribute('role', 'radio');
          }
          break;
        case 'NU-MENU':
          this.setAttribute('role', 'menuitem');
          break;
        case 'NU-TABLIST':
          this.setAttribute('role', 'tab');
          break;
        default:
          return;
      }

      if (this.parentNode.nuSetValue) {
        this.parentNode.nuSetValue(this.parentNode.nuGetValue(), false);
      }
    }, 0);
  }

  nuTap() {
    if (this.hasAttribute('disabled')) return;

    this.nuEmit('tap');

    const parent = this.parentNode;
    const value = this.nuGetValue();

    if (value && parent.nuSetValue && parent.nuGetValue() !== value) {
      parent.nuSetValue(value);
    }
  }

  nuChanged(name, oldValue, value) {
    super.nuChanged(name, oldValue, value);

    switch (name) {
      case 'disabled':
        this.nuSetMod('disabled', value != null);
        this.nuSetFocusable(value == null);
        break;
      case 'pressed':
        value = value != null;

        if (value && parent.nuSetValue) {
          parent.nuSetValue(value);
        } else {
          this.nuSetValue(value);
        }

        break;
      case 'value':
        if (this.parentNode && this.parentNode.nuSetValue) {
          this.parentNode.nuSetValue(this.parentNode.nuGetValue());
        }
        break;
    }
  }

  nuSetValue(value) {
    this.nuSetAria('pressed', value);

    setImmediate(() => {
      if (this.nuRole !== 'tab') return;

      if (value !== this.pressed) return;

      const controlsName = this.getAttribute('controls');

      if (!controlsName) return;

      const link = this.nuInvertQueryById(controlsName);

      if (link && link.nuSetMod) {
        const linkId = generateId(link);
        const tabId = generateId(this);

        link.nuSetAria('controls', linkId);
        link.nuSetAria('labelledby', tabId);
        link.nuSetMod('hidden', !value);

        if (!link.nuRole) {
          link.nuRole = 'tabpanel';
        }
      }
    });
  }

  get pressed() {
    return this.getAttribute('aria-pressed') === 'true';
  }

  nuGetValue() {
    return this.getAttribute('value') || this.getAttribute('controls');
  }
}

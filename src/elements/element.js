import {
  generateId,
  setImmediate,
  parseAllValues, h,
} from '../helpers';
import NuBase from './base';
import BaseAttributes from '../attributes/base';
import TransformCombinator from '../combinators/transform';
import ShadowCombinator from '../combinators/shadow';
// import WeightCombinator from '../combinators/weight';
import { BEHAVIORS } from '../behaviors/index';
import { collapse } from '../effects/collapse';

/**
 * @class
 * @abstract
 */
export default class NuElement extends NuBase {
  static get nuTag() {
    return 'nu-el'; // abstract tag
  }

  /**
   * Element attribute config.
   * @returns {Object}
   */
  static get nuGenerators() {
    return {
      ...BaseAttributes,
      role: '',
      direction: '',
      control: '',
      checkbox: '',
      trigger: '',
      collapsed: '',
      label: '',
      level: '',
      labelledby: '',
      describedby: '',
      valuemin: '',
      valuemax: '',
      valuenow: '',
      setsize: '',
      posinset: '',
      expanded: '',
      owns: '',
      flowto: '',
      haspopup: '',
      activedescendant: '',
      t(val) {
        return val
          ? {
            $suffix: ` > [name="${val}"]`,
            display: `block !important`,
          } : null;
      },
      ...Object.keys(BEHAVIORS).reduce((map, name) => {
        map[`nx-${name}`] = '';

        return map;
      }, {}),
      type: '',
      precision: '',
      disabled: '',
      'link-value': '',
      value: '',
      'off-value': '',
      scrollto: '',
      action: '',
      lang: '',
      special: '',
      placeholder: '',
      min: '',
      max: '',
      step: '',
      code: '',
      sign: '',
      unit: '',
      notation: '',
      fallback: '',
      significant: '',
      integer: '',
      decimal: '',
      pressed: '',
      checked: '',
      selected: '',
      target: '',
      to: '',
      begin: '',
      end: '',
      for: '',
      assert: '',
      enumerate: '',
      date: '',
      time: '',
      weekday: '',
      era: '',
      year: '',
      month: '',
      day: '',
      hour: '',
      minute: '',
      second: '',
      zone: '',
      timezone: '',
      dayperiod: '',
      calendar: '',
      system: '',
      hourcycle: '',
      format: '',
      src: '',
      autofocus: '',
      maxlength: '',
      mode: '',
      mask: '',
      list: '',
      // converters
      typographer: '',
      linkify: '',
    };
  }

  static get nuName() {
    return '';
  }

  /**
   * Element default attribute values.
   * They are used only to generate initial CSS for elements.
   */
  static get nuStyles() {
    return {
      display: 'inline-block',
      sizing: 'border',
    };
  }

  static get nuCombinators() {
    return {
      transform: TransformCombinator(),
      shadow: ShadowCombinator(),
      // weight: WeightCombinator(),
    };
  }

  /**
   * Element initialization logic
   */
  static nuCSS({ tag, css }) {
    return `
      ${css}
      ${tag}[hidden] {
        display: none !important;
      }
      ${tag}::selection {
        background-color: rgba(var(--nu-main-special-bg-color-rgb, var(--nu-special-bg-color-rgb)), .33) !important;
      }
    `;
  }

  /**
   * Attribute change reaction.
   * @param {String} name
   * @param {*} oldValue
   * @param {*} value
   */
  nuChanged(name, oldValue, value) {
    super.nuChanged(name, oldValue, value);

    switch (name) {
      // ARIA
      case 'label':
      case 'level':
      case 'valuemin':
      case 'valuemax':
      case 'valuenow':
      case 'setsize':
      case 'posinset':
      case 'expanded':
      case 'haspopup':
        this.nuSetAria(name, this.nuGetAttr(name, true));
        break;
      case 'controls':
      case 'labelledby':
      case 'describedby':
      case 'owns':
      case 'flowto':
      case 'activedescendant':
        setImmediate(() => {
          value = this.nuGetAttr(name, true);

          const ariaValue = value.split(/\s+/g).map((id) => {
            let link;

            link = this.nuQueryById(id);

            if (!link) return '';

            return generateId(link);
          }).join(' ');

          if (ariaValue.trim()) {
            this.nuSetAria(name, ariaValue);
          }
        });
        break;
      case 't':
        if (!this.nuIsConnected) return;

        value = this.nuGetAttr(name);

        const labels = parseAllValues(value);

        // empty tag
        this.innerHTML = '';

        labels.forEach(label => {
          if (this.querySelector(`nu-el[name="${label}"]`)) return;

          const el = h('nu-el');

          el.setAttribute('name', label);
          el.style.display = 'none';
          el.innerHTML = label.replace(/(^'|'$)/g, '');

          this.appendChild(el);
        });
        break;
      case 'collapsed':
        collapse(this, value != null);
        break;
    }
  }

  nuConnected() {
    super.nuConnected();

    if (this.hasAttribute('t')) {
      this.nuChanged('t', null, this.getAttribute('t'));
    }
  }

  nuIsClamped() {
    return this.scrollHeight > this.offsetHeight || this.scrollWidth > this.offsetWidth;
  }
}

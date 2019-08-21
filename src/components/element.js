import { convertUnit, getTheme, error, generateNuId, toCamelCase, extractColor, mixColors } from '../helpers';
import Modifiers, { SIZES } from '../modifiers';
import { hasCSS, injectCSS, removeCSS, attrsQuery, generateCSS } from '../css';
import NuBase from '../base';
import { THEME_ATTRS_LIST } from '../attrs';

const attrsObjs = [];
const plugins = {
  theme: '',
  cursor: 'cursor',
  responsive: ''
};

const RESPONSIVE_ATTR = 'responsive';
const THEME_ATTR = 'theme';

/**
 * @class
 * @abstract
 */
export default class NuElement extends NuBase {
  static get nuTag() {
    return 'nu-element'; // abstract tag
  }

  /**
   * Element ARIA Role.
   * @returns {string}
   */
  static get nuRole() {
    return '';
  }

  /**
   * Element layout type.
   * @returns {string} - `flex` | `grid`.
   */
  static get nuDisplay() {
    return '';
  }

  /**
   * Element default flow. Only for flex and grid layouts.
   * @returns {string} - `row` | `row-reverse` | `column` | `column-reverse`.
   */
  static get nuDefaultFlow() {
    return 'row';
  }

  /**
   * Element attribute config.
   * @returns {Object}
   */
  static get nuAttrs() {
    return {
      color: 'color',
      background: 'background',
      mod(val) {
        if (!val) return;

        return Modifiers.get(val);
      },
      cursor(val) {
        return val
          ? {
              cursor: val
            }
          : null;
      },
      size(val) {
        if (!val) return null;

        const tmp = val.trim().split(/\s+/);
        const values = [];

        values[0] = SIZES[tmp[0]] ? String(SIZES[tmp[0]][0]) : tmp[0];

        if (!tmp[1] && SIZES[tmp[0]]) {
          values[1] = String(SIZES[tmp[0]][1]);
        } else {
          values[1] = SIZES[tmp[1]] ? String(SIZES[tmp[1]][1]) : tmp[1];
        }

        return {
          'font-size': convertUnit(values[0]),
          'line-height': convertUnit(values[1] || '1.5')
        };
      },
      hidden(val) {
        if (val !== 'true' && val !== '') return null;

        return { display: 'none !important' };
      },
      ...plugins
    };
  }

  /**
   * @private
   * @returns {string[]}
   */
  static get nuAttrsList() {
    return Object.keys(this.nuAllAttrs);
  }

  /**
   * @private
   * @returns {string[]}
   */
  static get observedAttributes() {
    return this.nuAttrsList;
  }

  get nuDefaultFlow() {
    return this.constructor.nuDefaultFlow;
  }

  get nuRole() {
    return this.getAttribute('role') || this.constructor.nuRole;
  }

  set nuRole(value) {
    this.setAttribute('role', value);
  }

  constructor() {
    super();

    this.nuTabIndex = 0;
    this.nuRef = null;
    this.nuThemes = {};
  }

  /**
   * @private
   */
  connectedCallback() {
    const nuRole = this.constructor.nuRole;

    if (!this.hasAttribute('role') && nuRole) {
      this.setAttribute('role', nuRole);
    }

    this.nuMounted();

    this.nuIsMounted = true;
  }

  /**
   * @private
   * @param {string} name
   * @param {*} oldValue
   * @param {*} value
   */
  attributeChangedCallback(name, oldValue, value) {
    this.nuChanged(name, oldValue, value);

    if (value == null || !this.constructor.nuAllAttrs[name]) return;

    this.nuApplyCSS(name, value);
  }

  /**
   * Create and apply CSS based on element's attributes.
   * @param {string} name
   * @param {*} value
   * @param {*} force - replace current CSS rule
   */
  nuApplyCSS(name, value, force = false) {
    const isResponsive = value.includes('|');

    let query;

    if (isResponsive) {
      query = `${this.nuGetResponsiveContext()}${this.nuGetQuery({ [name]: value }, this.getAttribute(RESPONSIVE_ATTR))}`;
    } else {
      query = this.nuGetQuery({ [name]: value });
    }

    if (hasCSS(query)) {
      if (!force) return;

      removeCSS(query);
    }

    // responsive attribute
    if (isResponsive) {
      this.nuSetMod(RESPONSIVE_ATTR, true);

      if (value !== this.getAttribute(name)) return;

      let respEl = this;

      while (respEl && (!respEl.getAttribute(RESPONSIVE_ATTR) || !respEl.nuResponsive)) {
        respEl = respEl.parentNode;
      }

      if (!respEl) return;

      const styles = value.split('|').map((val, i) => {
        const stls = this.nuGenerate(name, val);

        return generateCSS(query, stls);
      });

      const css = respEl.nuResponsive()(styles);

      if (css) {
        injectCSS(query, query, css);
      }

      return;
    }

    let styles = this.nuGenerate(name, value);

    const css = generateCSS(query, styles);

    if (css) {
      injectCSS(query, query, css);
    }
  }

  /**
   * Calculate the style that needs to be applied based on corresponding attribute.
   * @param {string} name - attribute name
   * @param {string} value - original attribute name
   * @returns {string|Object}
   */
  nuComputeStyle(name, value) {
    const attrValue = this.constructor.nuAllAttrs[name];

    if (!attrValue) return null;

    switch (typeof attrValue) {
      case 'string':
        return value ? { [attrValue]: value } : null;
      case 'function':
        return attrValue(value);
      default:
        return null;
    }
  }

  /**
   * Set aria attribute.
   * @param {string} name
   * @param {*} value
   */
  nuSetAria(name, value) {
    if (typeof value === 'boolean') {
      value = value ? 'true' : 'false';
    }

    if (value == null) {
      this.removeAttribute(`aria-${name}`);
    } else {
      this.setAttribute(`aria-${name}`, value);
    }
  }

  nuGetQuery(attrs = {}, useId) {
    return `${this.constructor.nuTag}${useId ? `[data-nu-id="${this.nuId}"]` : ''}${attrsQuery(attrs)}`;
  }

  /**
   * Update theme of the element.
   * @param {string} attrTheme
   */
  nuUpdateTheme(attrTheme) {
    let invert = false;

    let theme = getTheme(attrTheme);

    if (theme === '!current') {
      setTimeout(() => {
        if (theme !== getTheme(this.getAttribute(THEME_ATTR))) return;

        const themeParent = this.nuQueryParent('[data-nu-theme]');

        let parentAttrTheme = themeParent ? themeParent.getAttribute('data-nu-theme') : '';

        if (!parentAttrTheme) return;

        theme = getTheme(parentAttrTheme, true);

        this.setAttribute('data-nu-theme', theme);

        this.nuUpdateChildThemes();
      }, 0); // parent node could no be ready

      return;
    }

    if (theme === 'current') {
      this.removeAttribute('data-nu-theme');
    } else {
      this.setAttribute('data-nu-theme', theme);
    }

    this.nuUpdateChildThemes();
  }

  nuUpdateChildThemes() {
    [...this.querySelectorAll('[theme="!"]')].forEach(
      element => element.nuUpdateTheme && element.nuUpdateTheme('!')
    );
  }

  /**
   * Make element focusable or temporarily disable that ability.
   * @param {boolean} bool
   */
  nuSetFocusable(bool) {
    if (bool) {
      (this.nuRef || this).setAttribute('tabindex', this.nuTabIndex);
    } else {
      (this.nuRef || this).removeAttribute('tabindex');
    }

    if (this.nuFocusable) return;

    (this.nuRef || this).addEventListener('focus', () => {
      this.nuSetMod('focus', true);
    });

    (this.nuRef || this).addEventListener('blur', () => {
      this.nuSetMod('focus', false);
    });

    if (document.activeElement === this.nuRef) {
      this.nuSetMod('focus', true);
    }

    this.nuFocusable = true;
  }

  /**
   * Called when element is connected to the DOM.
   * Can be called twice or more.
   */
  nuMounted() {

  }

  /**
   * React to the attribute change.
   * @param {string} name
   * @param {*} value
   * @returns {Array}
   */
  nuGenerate(name, value) {
    switch (name) {
      default:
        if (value == null) return;

        const computed = this.nuComputeStyle(name, value);

        if (!computed) return;

        return Array.isArray(computed) ? computed : [computed];
    }
  }

  nuChanged(name, oldValue, value) {
    switch (name) {
      case THEME_ATTR:
        this.nuUpdateTheme(value);
        break;
      case RESPONSIVE_ATTR:
        generateNuId(this);

        setTimeout(() => {
          if (this.getAttribute(RESPONSIVE_ATTR) !== value) return;
          /**
           * @type {NuElement[]}
           */
          const elements = this.querySelectorAll('[nu-responsive]');

          [...elements].forEach(el => {
            if (el.nuApplyCSS) {
              [...el.attributes].forEach(({ name, value }) => {
                if (!el.constructor.nuAttrsList.includes(name) || !value.includes('|')) return;

                el.nuApplyCSS(name, value, true);
              });
            }
          });
        }, 0);
        break;
    }
  }

  nuResponsive() {
    const points = this.getAttribute('responsive');

    if (this.nuReponsiveFor === points) return this.nuResponsiveDecorator;

    this.nuReponsiveFor = points;

    if (!points) {
      return this.nuResponsiveDecorator = (styles) => styles;
    }

    const tmpPoints = points.split(/\|/);

    const mediaPoints = tmpPoints.map((point, i) => {
      if (!i) {
        return `@media (min-width: ${point})`;
      }

      const prevPoint = tmpPoints[i - 1];

      return `@media (max-width: calc(${prevPoint} - 1px)) and (min-width: ${point})`;
    });

    mediaPoints.push(`@media (max-width: calc(${tmpPoints.slice(-1)[0]} - 1px))`);

    return (this.nuResponsiveDecorator = function(styles) {
      return mediaPoints
        .map((point, i) => {
          let stls;

          if (styles[i]) {
            stls = styles[i];
          } else {
            for (let j = i - 1; j >= 0; j--) {
              if (styles[j]) {
                stls = styles[j];
                break;
              }
            }
          }

          return `${point}{\n${stls || ''}\n}\n`;
        })
        .join('');
    });
  }

  nuGetResponsiveContext() {
    let context = '', el = this;

    while (el = el.parentNode) {
      if (el.getAttribute && el.getAttribute(RESPONSIVE_ATTR) && el.dataset.nuId) {
        context = `[data-nu-id="${el.dataset.nuId}"] ${context}`;
      }
    };

    return context;
  }

  /**
   * Declare theme in current context.
   * @param {String} name – Theme name.
   * @param {Object} props
   */
  nuDeclareTheme(name, props) {
    if (!props) {
      delete this.nuThemes[name];
      this.setAttribute(`data-nu-themes`, Object.keys(this.nuThemes).join(' '));

      return;
    }

    if (name !== 'default' && this.nuThemes.default) {
      props = {
        ...this.nuThemes.default,
        ...props,
      };
    }

    this.nuThemes[name] = props;
    this.setAttribute(`data-nu-themes`, Object.keys(this.nuThemes).join(' '));

    const parentStyles = window.getComputedStyle(this.parentNode);
    const parentProps = THEME_ATTRS_LIST.reduce((map, name) => {
      const value = parentStyles.getPropertyValue(`--nu-theme-${name}`);

      if (value) {
        map[toCamelCase(name)] = value;
      }

      return map;
    }, {});

    const normalTheme = {
      '--nu-theme-color': props.color || parentProps.color,
      '--nu-theme-background-color': props.backgroundColor || parentProps.backgroundColor,
      '--nu-theme-border-color': props.borderColor || parentProps.borderColor,
      '--nu-theme-special-color': props.specialColor || parentProps.specialColor,
      '--nu-theme-border-radius': props.borderRadius || parentProps.borderRadius,
      '--nu-theme-border-width': props.borderWidth || parentProps.borderWidth,
      '--nu-theme-shadow-color': props.shadowColor || parentProps.shadowColor,
      '--nu-theme-shadow-intensity': props.shadowIntensity
        || (props.shadowColor && extractColor(props.shadowColor)[3]) || parentProps.shadowIntensity,
      '--nu-theme-special-background-color': props.backgroundColor || parentProps.backgroundColor;
      '--nu-theme-focus-color': mixColors(
        props.specialColor || parentProps.specialColor,
        props.backgroundColor || parentProps.backgroundColor
      ),
      '--nu-theme-heading-color': mixColors(
        props.color || parentProps.color,
        props.backgroundColor || parentProps.backgroundColor,
        .1,
      ),
      '--nu-theme-hover-color': mixColors(
        props.backgroundColor || parentProps.backgroundColor,
        props.specialColor || parentProps.specialColor,
        .1,
      ),
    };

    let darkTheme;

    [normalTheme, invertTheme].forEach(theme => {

    });
  }
}

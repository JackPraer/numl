import NuElement from './element';
import DirectionMixin from '../mixins/direction';

export default class NuTriangle extends NuElement {
  static get nuTag() {
    return 'nu-triangle';
  }

  static get nuDefaults() {
    return {
      direction: 'up',
      display: 'block',
      color: 'border',
      overflow: 'no',
      text: 'v-middle',
      height: '0',
      width: '0',
      border: '(1fs / 2) color(clear)',
    };
  }

  static get nuMixins() {
    return {
      direction: DirectionMixin(),
    };
  }

  static nuCSS({ tag, css }) {
    return `
      ${css}
      ${tag} {
        font-size: inherit;
        line-height: inherit;
      }
      ${tag}:not([border]):not([border]) {
        border-top: 0;
        border-bottom-color: currentColor;
        border-bottom-width: calc(var(--nu-line-height) / 2);
      }
      ${tag}:not([size]):not([size]) {
        font-size: inherit;
        line-height: inherit;
      }
    `;
  }
}

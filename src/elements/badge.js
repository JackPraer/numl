import NuBlock from './block';
import NuElement from './element';

export default class NuBadge extends NuElement {
  static get nuTag() {
    return 'nu-badge';
  }

  static get nuAttrs() {
    return {
      border: NuBlock.nuAttrs.border,
      radius: NuBlock.nuAttrs.radius,
      shadow: NuBlock.nuAttrs.shadow,
    };
  }

  static get nuDefaults() {
    return {
      display: 'inline-grid',
      flow: 'column',
      gap: '1x',
      items: 'center',
      padding: '0 .5em',
      radius: 'round',
      text: 'nowrap :special[w5 nowrap]',
      border: '1b',
      fill: 'bg :special[special-bg]',
      color: 'text :special[special-text]',
    };
  }

  nuChanged(name, oldValue, value) {
    super.nuChanged(name, oldValue, value);
  }

  static nuCSS({ tag, css }) {
    return `
      ${css}
      ${tag} {
        position: relative;
        line-height: calc(var(--nu-line-height) - 1px);
      }
    `;
  }
}

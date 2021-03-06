import NuActiveElement from './activeelement';

export default class NuBtn extends NuActiveElement {
  static get nuTag() {
    return 'nu-btn';
  }

  static get nuStyles() {
    return {
      display: 'inline-grid',
      padding: '1x 2x',
      border: '1bw :clear[hidden] :hover[1bw] :clear:hover[color(mark)]',
      radius: '1r',
      flow: 'column',
      gap: '1x',
      content: 'center :dropdown[stretch]',
      items: 'center stretch',
      mark: ':focusable[hover]',
      fill: 'bg :special[special-bg] :themed[bg] :special:themed[special-bg] :clear[clear] :clear:themed[bg]',
      text: 'nowrap :special[w5 nowrap]',
      inset: 'n :active:focusable[y] :pressed:focusable[y] :pressed[y] :pressed:active[y]',
      color: 'text :clear[special] :special[special-text] :special:clear[special-text]',
    };
  }

  static get nuAttrs() {
    return {
      as: 'btn',
    };
  }

  static nuCSS({ tag, css }) {
    return `
      ${css}
      ${tag}[special] > :not([theme]) {
        --nu-text-soft-color: var(--nu-special-text-color);
        --nu-text-contrast-color: var(--nu-special-text-color);
        --nu-text-color: var(--nu-special-text-color);
        --nu-special-color: var(--nu-special-text-color);
        --nu-mark-color: var(--nu-special-mark-color);
      }
    `;
  }
}

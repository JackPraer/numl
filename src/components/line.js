import { unit } from '../helpers';
import NuBlock from './block';

export default class NuLine extends NuBlock {
  static get nuTag() {
    return 'nu-line';
  }

  static get nuRole() {
    return 'separator';
  }

  static get nuAttrs() {
    return {
      ...NuBlock.nuAttrs,
      orientation: '',
      size: unit('--nu-line-size'),
      color: '--nu-line-color'
    };
  }

  static nuCSS(tag) {
    `
      ${tag} {
        --nu-line-color: var(--nu-theme-border-color);
        --nu-line-size: var(--nu-theme-border-width);

        display: block;
        position: relative;
        line-height: 0;
        align-self: stretch;
        justify-self: stretch;
        background-color: var(--nu-line-color);
      }

      ${tag}:not([orientation="vertical"]) {
        min-height: var(--nu-line-size);
        max-height: var(--nu-line-size);
        min-width: 100%;
        max-width: 100%;
        grid-column: 1 / -1;
      }

      ${tag}[orientation="vertical"] {
        min-height: var(--nu-line-size);
        max-height: var(--nu-line-size);
        min-width: 100%;
        max-width: 100%;
        grid-row: 1 / -1;
      }
    `;
  }

  constructor() {
    super();
  }

  nuChanged(name, oldValue, value) {
    super.nuChanged(name, oldValue, value);

    if (name === 'orientation') {
      this.nuSetMod('vertical', value === 'vertical');
      this.nuSetAria('orientation', value === 'vertical' ? 'vertical' : null);
    }
  }
}

import NuAbstractBtn from './abstract-btn';
import focusable from '../mixins/focusable';

export default class NuTab extends NuAbstractBtn {
  static get nuTag() {
    return 'nu-tab';
  }

  static get nuRole() {
    return 'tab';
  }

  static nuCSS({ nuTag }) {
    return `
      ${nuTag} {
        --nu-toggle-color: transparent;
        --nu-depth-color: transparent;
        --nu-border-radius: 0;
        --nu-border-color: transparent;

        --nu-toggle-shadow: 0 calc(-1 * var(--nu-theme-border-width)) 0 0 var(--nu-toggle-color) inset;
        --nu-border-inset: inset 0 0;
        --nu-border-width: 0;
        --nu-border-shadow: var(--nu-border-inset) 0 var(--nu-border-width) var(--nu-border-color);
        --nu-depth-shadow: 0 0 0 rgba(0, 0, 0, 0);

        padding: .5rem 0;
        background-color: transparent;
        align-items: center;
        justify-items: center;
      }

      ${nuTag}[nu-active][tabindex]:not([disabled]):not([nu-toggled]),
      ${nuTag}[nu-toggled]:not([disabled]):not([tabindex]) {
        --nu-toggle-shadow: 0 calc(1em / 16 * -3) 0 0 var(--nu-toggle-color) inset;
        --nu-toggle-color: var(--nu-theme-special-color);
      }

      ${nuTag}[special] {
        color: var(--nu-theme-special-color);
      }

      ${nuTag}:not([disabled])[tabindex]:hover {
        --nu-toggle-color: var(--nu-theme-special-color);
      }

      ${nuTag}[nu-active][tabindex]:not([disabled]):not([nu-toggled]),
      ${nuTag}[nu-toggled]:not([disabled]) {
        --nu-toggle-shadow: 0 calc(1em / 16 * -3) 0 0 var(--nu-toggle-color) inset;
        --nu-toggle-color: var(--nu-theme-special-color);
      }
    `;
  }

  nusetValue(value) {
    super.nuSetValue(value);

    setTimeout(() => {
      if (value !== this.nuHasMod('toggled')) return;

      const controlsName = this.getAttribute('controls');

      if (!controlsName) return;

      const link = this.nuInvertQuery(`[name="${controlsName}"]`);

      if (link && link.nuSetMod) {
        const linkId = generateId(link);
        const tabId = generateId(this);

        this.nuSetAria('controls', linkId);
        link.nuSetAria('labelledby', tabId);
        link.nuSetMod('hidden', !value);

        if (!link.nuRole) {
          link.nuRole = 'tabpanel';
        }
      }
    }, 0);
  }
}

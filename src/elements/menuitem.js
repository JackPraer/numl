import NuAbstractBtn from './abstract-btn';

export default class NuMenuitem extends NuAbstractBtn {
  static get nuTag() {
    return 'nu-menuitem';
  }

  static get nuRole() {
    return 'menuitem';
  }

  static get nuDefaults() {
    return {
      background: 'transparent',
      width: '100%',
      content: 'center start',
      radius: 0,
    };
  }

  static nuCSS({ nuTag }) {
    return `
      ${nuTag} {
        --nu-toggle-color: transparent;
        --nu-depth-color: transparent;
        --nu-focus-inset: inset 0 0;
      }

      ${nuTag}:not([disabled])[tabindex]:hover {
        --nu-hover-color: var(--nu-theme-hover-color);
      }

      ${nuTag}[nu-active][tabindex]:not([disabled]):not([nu-toggled]),
      ${nuTag}[nu-toggled]:not([disabled]):not([tabindex]) {
        --nu-toggle-color: rgba(0, 0, 0, var(--nu-theme-shadow-opacity));
      }

      ${nuTag}[special] {
        background-color: var(--nu-theme-special-color) !important;
        color: var(--nu-theme-special-background-color) !important;
      }
    `;
  }
}

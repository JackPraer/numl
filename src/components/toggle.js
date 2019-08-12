import NuBtn from './btn';

export default class NuToggle extends NuBtn {
  static get nuTag() {
    return 'nu-toggle';
  }

  static get nuAttrs() {
    return {
      disabled: '',
      value: '',
    };
  }

  static nuCSS({ nuTag }) {
    return `
      ${nuTag} {
        --nu-depth-color: transparent;
        --nu-border-radius: calc(var(--nu-size) / 2);
        --nu-toggle-color: transparent;

        --nu-border-shadow: 0 0 0 var(--nu-theme-border-width) var(--nu-theme-border-color) inset;
        --nu-depth-shadow: 0 .25rem 1.5rem var(--nu-depth-color);
        --nu-background-color: var(--nu-theme-background-color);
        --nu-toggle-shadow: 0 0 1rem 0 var(--nu-toggle-color) inset;

        --nu-size: 2em;
        --nu-circle-padding: calc(var(--nu-theme-border-width) * 4);
        --nu-circle-size: calc(var(--nu-size) - var(--nu-circle-padding) * 2);
        --nu-circle-offset: var(--nu-circle-padding);
        --nu-circle-opacity: .5;
        --nu-circle-border-radius: calc(var(--nu-circle-size) / 2);
        --nu-circle-background-color: var(--nu-theme-color);

        position: relative;
        display: inline-block;
        width: calc(var(--nu-size) * 2);
        height: var(--nu-size);
        border-radius: var(--nu-border-radius);
        background-color: var(--nu-background-color);
        cursor: pointer;
        box-shadow: var(--nu-depth-shadow),
          var(--nu-focus-background-shadow),
          var(--nu-toggle-shadow),
          var(--nu-border-shadow);
        transition: box-shadow var(--nu-theme-animation-time) linear,
        filter var(--nu-theme-animation-time) linear;
        user-select: none;
        vertical-align: middle;
      }

      ${nuTag}::after {
        content: "";
        position: absolute;
        display: block;
        width: var(--nu-circle-size);
        height: var(--nu-circle-size);
        pointer-events: none;
        left: 0;
        top: var(--nu-circle-padding);
        transform: translate(var(--nu-circle-offset), 0);
        transition: transform var(--nu-theme-animation-time) linear,
          opacity var(--nu-theme-animation-time) linear,
          background-color var(--nu-theme-animation-time) linear;
        background-color: var(--nu-circle-background-color);
        border-radius: var(--nu-circle-border-radius);
        /*box-shadow: var(--nu-border-shadow);*/
        opacity: var(--nu-circle-opacity);
      }

      ${nuTag}[disabled] {
        opacity: .5;
        cursor: default;
      }

      ${nuTag}[nu-toggled] {
        --nu-background-color: var(--nu-theme-special-color);
        --nu-circle-offset: calc(var(--nu-size) * 2 - var(--nu-circle-padding) - var(--nu-circle-size));
        --nu-circle-opacity: 1;
        --nu-circle-background-color: var(--nu-theme-background-color);
      }

      ${nuTag}[nu-active]:not([disabled]) {
        --nu-toggle-color: rgba(0, 0, 0, 0.2);
      }
    `;
  }

  constructor() {
    super();
  }

  nuTap() {
    this.nuSetMod('toggled', !this.nuHasMod('toggled'))

    this.nuEmit('tap');
  }
}

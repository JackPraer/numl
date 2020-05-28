import {
  unit,
} from '../helpers';
import NuBlock from './block';

export default class NuInput extends NuBlock {
  static get nuTag() {
    return 'nu-input';
  }

  static get nuBehaviors() {
    return {
      input: true,
    };
  }

  static get nuAttrs() {
    return {
      autofocus: '',
      disabled: '',
      placeholder: '',
      value: '',
      maxlength: '',
      name: '',
      padding: unit('--nu-local-padding', {
        empty: '--nu-gap',
        convert: true,
      }),
    };
  }

  static get nuDefaults() {
    return {
      display: 'grid',
      flow: 'column',
      radius: '',
      padding: '1x',
      fill: 'input :disabled[special-bg 20%]',
      border: '1b',
      focus: 'inside input',
      opacity: '1 :disabled[.5]',
    };
  }

  static nuCSS({ tag, css }) {
    return `
      ${css}
      ${tag} {
        outline: none;
        user-select: none;
        position: relative;
      }

      ${tag} input {
        padding: var(--nu-local-padding);
        width: 100%;
        max-width: 100%;
        min-width: 100%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        -webkit-appearance: none;
        background: transparent;
        border: none;
        outline: none;
        border-radius: inherit;
        box-sizing: border-box;
        color: inherit;
        -webkit-text-fill-color: currentColor;
        word-spacing: calc(1rem / 8);
        height: min-content;
        min-height: 100%;
        user-select: all;
        text-align: inherit;
      }

      ${tag} input:-webkit-autofill, ${tag} input:-webkit-autofill:hover, ${tag} input:-webkit-autofill:focus {
        caret-color: var(--nu-special-color);
        -webkit-text-fill-color: var(--nu-special-color);
        -webkit-box-shadow: 0 0 0px 9999rem var(--nu-input-color) inset;
        box-shadow: 0 0 0px 9999rem var(--nu-input-color) inset;
      }

      ${tag} input[disabled] {
        color: inherit;
        background: transparent;
        -webkit-opacity: 1;
      }

      ${tag} input::placeholder {
        color: rgb(var(--nu-text-color-rgb), .6);
        -webkit-text-fill-color: currentColor;
      }

      ${tag} nu-icon:not([width]) {
        width: calc(var(--nu-local-padding) * 2 + 1em);
      }
    `;
  }
}

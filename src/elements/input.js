import {
  unit,
} from '../helpers';
import NuBlock from './block';
import focusable from '../mixins/focusable';

export default class NuInput extends NuBlock {
  static get nuTag() {
    return 'nu-input';
  }

  static get nuAttrs() {
    return {
      autofocus: '',
      disabled: '',
      value: '',
      maxlength: '',
      name: '',
      padding: unit('--nu-padding', {
        multiplier: 'var(--nu-theme-padding)',
        empty: 'var(--nu-theme-padding)',
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
      text: 'center',
      background: '',
      border: '1x',
    };
  }

  static nuCSS({ nuTag }) {
    return `
      ${nuTag} {
        outline: none;
        user-select: none;
        position: relative;
      }

      ${nuTag} input {
        padding: var(--nu-padding);
        width: 100%;
        max-width: 100%;
        min-width: 100%;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        -webkit-appearance: none;
        background: transparent;
        color: inherit;
        border: none;
        outline: none;
        border-radius: inherit;
        box-sizing: border-box;
      }
      
      ${nuTag} input:not(:first-child) {
        padding-left: 0;
      }
      
      ${nuTag} input:not(:last-child) {
        padding-right: 0;
      }

      ${nuTag} input[disabled] {
        color: var(--minor-color);
        background: var(--minor-background-color);
        -webkit-text-fill-color: var(--minor-color);
        -webkit-opacity: 1;
      }

      ${nuTag} input::placeholder {
        -webkit-text-fill-color: currentColor;
        color: currentColor;
        opacity: .5;
      }
      
      ${nuTag} nu-icon:not([width]) {
        width: calc(var(--nu-padding) * 2 + 1em);
      }

      ${focusable(nuTag, { force: true })}
    `;
  }

  nuGetRef() {
    this.nuRef = this.querySelector('input');

    if (!this.nuRef) {
      const input = document.createElement('input');

      this.appendChild(input);

      this.nuRef = input;
    }

    return this.nuRef;
  }

  nuChanged(name, oldValue, value) {
    super.nuChanged(name, oldValue, value);

    switch (name) {
      case 'disabled':
        this.nuGetRef();

        if (this.nuRef) {
          this.nuRef.disabled = value != null;
          this.nuSetFocusable(value != null);
        }

        break;
    }
  }

  nuConnected() {
    super.nuConnected();

    setTimeout(() => {
      this.nuChanged('disabled', '', this.getAttribute('disabled'));

      if (this.nuRef && !this.nuRef.hasAttribute('placeholder')) {
        this.nuRef.setAttribute('placeholder', '...');
      }
    });
  }
}

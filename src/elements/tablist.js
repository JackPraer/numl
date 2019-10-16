import NuRadioGroup from './radiogroup';

export default class NuTablist extends NuRadioGroup {
  static get nuTag() {
    return 'nu-tablist';
  }

  static get nuRole() {
    return 'tablist';
  }

  static get nuAttrs() {
    return {
      value: '',
    };
  }

  static get nuDefaults() {
    return {
      gap: 1,
    };
  }

  static nuCSS({ nuTag }) {
    return `
      ${nuTag}:not([gap]) > * {
        --nu-flex-gap: 1rem;
      }
    `;
  }
}

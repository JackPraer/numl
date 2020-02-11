import NuElement from './element';

export default class NuClamp extends NuElement {
  static get nuTag() {
    return 'nu-clamp';
  }

  static get nuAttrs() {
    return {
      max(val) {
        return {
          '--nu-local-max-lines': val,
        };
      },
    };
  }

  static get nuDefaults() {
    return {
      display: '-webkit-box',
      width: 'max(100%)',
    };
  }

  static nuCSS({ css, tag }) {
    return `
      ${css}
      ${tag} {
        overflow: hidden;
      }
      ${tag}:not([max]), ${tag}[max="1"] {
        display: block;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      ${tag}[max]:not([max="1"]) {
        -webkit-box-orient: vertical;
        -webkit-line-clamp: var(--nu-local-max-lines);
      }
    `;
  }
}

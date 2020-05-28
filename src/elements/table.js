import NuElement from './element';
import { unit } from '../helpers';
import borderAttr from '../attributes/border';

const gapAttr = unit('border-spacing', {
  convert: true,
  empty: '--nu-cell-padding',
});

export default class NuTable extends NuElement {
  static get nuTag() {
    return 'nu-table';
  }

  static get nuRole() {
    return 'table';
  }

  static get nuGenerators() {
    return {
      gap(val) {
        if (val == null) return;

        if (!val) {
          return {
            'border-collapse': 'collapse',
          };
        }

        return {
          'border-collapse': 'separate',
          ...gapAttr(val),
        };
      },
      border(val) {
        const styles = borderAttr(val);

        return [
          {
            ...styles,
            $suffix: ' nu-cell:not([border])',
          },
          {
            ...styles,
            $suffix: ' nu-rowheader:not([border])',
          },
          {
            ...styles,
            $suffix: ' nu-columnheader:not([border])',
          },
        ];
      },
      padding: unit('--nu-cell-padding', {
        empty: '--nu-gap',
        convert: true,
      }),
      radius: unit('--nu-local-radius', {
        empty: '--nu-radius',
        convert: true,
      }),
    };
  }

  static get nuStyles() {
    return {
      display: 'table',
      gap: '',
      border: '1bw',
      padding: '',
    };
  }

  static nuCSS({ tag, css }) {
    return `
      ${css}

      ${tag} {
        --nu-cell-padding: var(--nu-gap);
      }

      ${tag} >  nu-rowgroup:first-child >  nu-row:first-child > * {
        border-top: 0 !important;
      }

      ${tag} >  nu-rowgroup:last-child >  nu-row:last-child > * {
        border-bottom: 0 !important;
      }

      ${tag} >  nu-rowgroup >  nu-row > *:first-child {
        border-left: 0 !important;
      }

      ${tag} > nu-rowgroup > nu-row > *:last-child {
        border-right: 0 !important;
      }

      ${tag} >  nu-rowgroup:first-child >  nu-row:first-child > *:first-child {
        border-top-left-radius: var(--nu-local-radius, var(--nu-radius));
      }

      ${tag} >  nu-rowgroup:first-child >  nu-row:first-child > *:last-child {
        border-top-right-radius: var(--nu-local-radius, var(--nu-radius));
      }

      ${tag} >  nu-rowgroup:last-child >  nu-row:last-child > *:first-child {
        border-bottom-left-radius: var(--nu-local-radius, var(--nu-radius));
      }

      ${tag} >  nu-rowgroup:last-child >  nu-row:last-child > *:last-child {
        border-bottom-right-radius: var(--nu-local-radius, var(--nu-radius));
      }
    `;
  }
}

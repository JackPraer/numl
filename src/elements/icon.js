import {
  convertUnit, parseAllValues, svgElement, injectScript,
} from '../helpers';
import NuBlock from './block';

let featherPromise;

export default class NuIcon extends NuBlock {
  static get nuTag() {
    return 'nu-icon';
  }

  static get nuRole() {
    return 'img';
  }

  static nuLoader(name) {
    return (
      featherPromise ||
      (featherPromise = !window.feather
        ? injectScript('https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.22.1/feather.js')
        : Promise.resolve())
    ).then(() => window.feather.icons[name].toSvg());
  }

  static get nuAttrs() {
    return {
      size(val) {
        const converted = convertUnit(val || '');

        return val ? {
          'min-width': converted,
          'min-height': converted,
          '--nu-size': converted,
        } : null;
      },
      name(val, defaults) {
        return val
          ? {
            $suffix: ` > [name="${val}"]`,
            display: `${defaults.display} !important`,
          } : null;
      },
    };
  }

  static get nuDefaults() {
    return {
      display: 'inline-block',
    };
  }

  static nuCSS({ nuTag }) {
    return `
      ${nuTag} {
        --nu-size: 1em;

        position: relative;
        vertical-align: middle;
        min-width: 1em;
        min-height: 1em;
        background-color: transparent !important;
      }

      ${nuTag} > svg {
        position: absolute;
        left: 50%;
        top: 50%;
        width: var(--nu-size);
        height: var(--nu-size);
        transform: translate(-50%, -50%);
      }

      ${nuTag} > :not(svg) {
        display: none;
      }

      ${nuTag}[inline] {
        bottom: 0.0675em;
      }
    `;
  }

  nuChanged(name, oldValue, value) {
    super.nuChanged(name, oldValue, value);

    if (name === 'name') {
      const names = parseAllValues(value);

      // empty tag
      this.innerHTML = '';

      names.forEach(name => {
        if (this.querySelector(`svg[name="${name}"]`)) return;

        this.constructor.nuLoader(name).then(svg => {
          const svgNode = svgElement(svg);

          svgNode.setAttribute('name', name);
          svgNode.style.display = 'none';

          this.appendChild(svgNode);
        });
      });
    }
  }

  nuUpdateTheme(attrTheme) {
    super.nuUpdateTheme(attrTheme);
  }
}

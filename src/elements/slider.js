import NuElement from './element';
import combinedAttr from '../attributes/combined';

export default class NuSlider extends NuElement {
  static get nuTag() {
    return 'nu-slider';
  }

  static get nuRole() {
    return 'slider';
  }

  static get nuTemplate() {
    return `
      <nu-circle
        id="slider-cap"
        place="absolute"
        size="1.25em"
        radius="round"
        fill="special-text"
        border="1bw color(text)"
        space=".375em + 1bw"
        text="v-middle"
        move="--local-rail-move-v --local-rail-move-h"
        orient="h"
        opacity="1"
        outline="focus-outside"></nu-circle>
    `;
  }

  static get nuGenerators() {
    return {
      orient(val) {
        const vertical = val === 'v';

        return combinedAttr([{
          width: vertical ? '.5em' : '100%',
          height: vertical ? '10x' : '.5em',
          '--local-rail-move-h': vertical ? '.25em' : '0',
          '--local-rail-move-v': vertical ? '0' : '-.25em',
          '--local-rail-top': vertical ? 'initial' : '0',
          '--local-rail-left': vertical ? 'initial' : '--local-offset',
          '--local-rail-bottom': vertical ? '--local-offset' : 'initial',
          '--orient': vertical ? 'v' : 'h',
        }], NuSlider);
      },
    };
  }

  static get nuStyles() {
    return {
      display: 'inline-block',
      radius: 'round',
      fill: 'special-bg :disabled[text 50%]',
      opacity: '1 :disabled[.5]',
      border: '1bw',
      text: 'v-middle',
      cursor: 'pointer :disabled[default]',
      mark: '.5em hover :disabled[n]',
      transition: 'shadow',
      expand: '.5em',
      orient: 'h',
      outline: 'n',
    };
  }

  static get nuBehaviors() {
    return {
      orient: 'dynamic',
      slider: true,
    };
  }

  static nuCSS({ css, tag, shadow }) {
    return `
      ${css}
      ${!shadow ? `${tag} {
        position: relative;
      }` : ''}

      ${tag} nu-circle {
        position: absolute;
        top: var(--nu-local-rail-top);
        left: var(--nu-local-rail-left);
        bottom: var(--nu-local-rail-bottom);
      }
    `;
  }
}

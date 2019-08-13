import './global.css';
import css, { injectStyleTag } from './css';
import modifiers from './modifiers';
// elements
import NuElement from './components/element';
import NuGrid from './components/grid';
import NuBlock from './components/block';
import NuIcon from './components/icon';
import NuLine from './components/line';
import NuPane from './components/pane';
import NuCard from './components/card';
import NuLayout from './components/flow';
import NuBtn from './components/btn';
import NuToggle from './components/toggle';
import NuGridTable from './components/grid-table';
import NuBadge from './components/badge';
import NuLink from './components/link';
import NuInput from './components/input';
import NuScroll from './components/scroll';
import NuFlex from './components/flex';
import NuBtnGroup from './components/btn-group';
// decorators
import NuDecorator from './decorators/decorator';
import NdTheme from './decorators/theme';
import NdAttr from './decorators/attr';
import NdMod from './decorators/mod';
import NdResponsive from './decorators/responsive';
// helpers
import { log, injectScript } from './helpers';

let featherPromise;

if (window.feather) {
  featherPromise = Promise.resolve();
}

const Nude = {
  modifiers,
  css,
  iconLoader(name) {
    return (featherPromise || injectScript('https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.22.1/feather.js'))
      .then(() => window.feather.icons[name].toSvg());
  },
};

Nude.elements = {
  NuGridTable,
  NuPane,
  NuLine,
  NuLayout,
  NuIcon,
  NuCard,
  NuBtn,
  NuBlock,
  NuGrid,
  NuBadge,
  NuInput,
  NuScroll,
  NuToggle,
  NuFlex,
  NuBtnGroup,
  NuLink,
  NdTheme,
  NdAttr,
  NdMod,
  NdResponsive
};

Object.values(Nude.elements).forEach(customElement => {
  customElement.nuInit = function() {
    const tag = this.nuTag;
    let el = this, css = '';

    do {
      if (!el.nuCSS) break;
      if (el.nuCSS === (el.nuParent && el.nuParent.nuCSS)) continue;

      css = `${el.nuCSS(this)}${css}`;
    } while (el = el.nuParent);

    injectStyleTag(css, tag);

    customElements.define(tag, this);

    log('custom element registered', tag);
  }
});

Nude.init = () => {
  Object.values(Nude.elements).forEach(el => el.nuInit());
};

window.Nude = Nude;

export default Nude;

export {
  NuGrid,
  NuBlock,
  NuBtn,
  NuCard,
  NuIcon,
  NuLayout,
  NuLine,
  NuPane,
  NuGridTable,
  NuBadge,
  NuInput,
  NuScroll,
  NuToggle,
  NuFlex,
  NuBtnGroup,
  NuLink,
  NdTheme,
  NdAttr,
  NdMod,
  NuElement,
  NuDecorator,
  NdResponsive,
};

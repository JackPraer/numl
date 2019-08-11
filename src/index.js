import './global.css';
import './components/elements.css';
import './decorators/decorators.css';
import Nude from './nude';
import { inject } from './css';
// elements
import NuElement from './components/element';
import NuGrid from './components/grid';
import NuBlock from './components/block';
import NuIcon from './components/icon/icon';
import NuLine from './components/line/line';
import NuPane from './components/pane';
import NuCard from './components/card/card';
import NuLayout from './components/flow';
import NuBtn from './components/btn/btn';
import NuToggle from './components/btn/toggle';
import NuGridTable from './components/table/grid-table';
import NuCell from './components/table/cell';
import NuGridCell from './components/table/grid-cell';
import NuBadge from './components/badge/badge';
import NuLink from './components/link/link';
import NuInput from './components/form/input';
import NuScroll from './components/scroll/scroll';
import NuFlex from './components/flex';
import NuBtnGroup from './components/btn/btn-group';
// decorators
import NuDecorator from './decorators/decorator';
import NdTheme from './decorators/theme';
import NdAttr from './decorators/attr';
import NdMod from './decorators/mod';
import NdResponsive from './decorators/responsive';
// helpers
import { log } from './helpers';

export default Nude;

window.Nude = Nude;

Nude.init = () => {
  [
    NuGridCell,
    NuCell,
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
    NdResponsive,
  ].forEach(customElement => {
    customElement.nuInit();

    customElements.define(customElement.nuTag, customElement);

    log('custom element registered', customElement.nuTag);
  });
};

export {
  NuGrid,
  NuBlock,
  NuBtn,
  NuCard,
  NuIcon,
  NuLayout,
  NuLine as NuSeparator,
  NuPane,
  NuGridTable as NuTable,
  NuCell,
  NuGridCell,
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

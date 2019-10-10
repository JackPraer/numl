import Nude, {
  NuBase,
  NuGrid,
  NuBlock,
  NuHeading,
  NuBtn,
  NuTab,
  NuCard,
  NuIcon,
  NuLayout,
  NuLine,
  NuPane,
  NuGridTable,
  NuBadge,
  NuInput,
  NuScroll,
  NuSwitch,
  NuFlex,
  NuBtnGroup,
  NuTablist,
  NuMenu,
  NuMenuItem,
  NuLink,
  NuTheme,
  NuMod,
  NuVar,
  NuDecorator,
  NuAbstractBtn,
  NuTriangle,
  NuTooltip,
} from './index';

Nude.elements = {
  NuGrid,
  NuBlock,
  NuHeading,
  NuBtn,
  NuTab,
  NuCard,
  NuIcon,
  NuLayout,
  NuLine,
  NuPane,
  NuGridTable,
  NuBadge,
  NuInput,
  NuScroll,
  NuSwitch,
  NuFlex,
  NuBtnGroup,
  NuTablist,
  NuMenu,
  NuMenuItem,
  NuLink,
  NuTheme,
  NuMod,
  NuVar,
  NuDecorator,
  NuAbstractBtn,
  NuTriangle,
  NuTooltip,
};

Nude.init(
  ...Object.values(Nude.elements),
);

Nude.elements.NuBase = NuBase;

window.Nude = Nude;

export default Nude;

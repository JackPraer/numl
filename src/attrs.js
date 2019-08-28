import { convertUnit, unit, sizeUnit } from './helpers';

const PLACE_VALUES = [
  'content', 'items', 'self'
].map((name) => {
  return CSS.supports(`place-${name}`, 'stretch stretch')
    ? `place-${name}` : function(val) {
      const values = val && val.trim().split(/\s+/);

      return val ? {
        [`align-${name}`]: values[0],
        [`justify-${name}`]: values[1] || values[0],
      } : null;
    };
});

export const PLACE_ATTRS = {
  'place-content': PLACE_VALUES[0],
  'place-items': PLACE_VALUES[1],
  'content': PLACE_VALUES[0],
  'items': PLACE_VALUES[1],
};

export const PLACE_SELF_ATTRS = {
  'place-self': PLACE_VALUES[2],
  'place': PLACE_VALUES[2],
};

export const FLEX_ITEM_ATTRS = {
  ...PLACE_SELF_ATTRS,
  grow: 'flex-grow',
  shrink: 'flex-shrink',
  basis: unit('flex-basis'),
  'flex-grow': 'flex-grow',
  'flex-shrink': 'flex-shrink',
  'flex-basis': unit('flex-basis'),
};

export const GRID_ITEM_ATTRS = {
  ...PLACE_SELF_ATTRS,
  column: 'grid-column',
  col: 'grid-column',
  row: 'grid-row',
  area: 'grid-area',
};

export const GRID_ATTRS = {
  ...PLACE_ATTRS,
  'template-areas': 'grid-template-areas',
  areas: 'grid-template-areas',
  'auto-flow': 'grid-auto-flow',
  flow: 'grid-auto-flow',
  'template-columns': unit('grid-template-columns'),
  'template-rows': unit('grid-template-rows'),
  cols: unit('grid-template-columns'),
  rows: unit('grid-template-rows'),
  gap: unit('grid-gap'),
};

export const THEME_COLOR_ATTRS_LIST = [
  'color',
  'background-color',
  'special-color',
  'border-color',
  'outline-color',
  'shadow-color',
  'heading-color',
  'hover-color',
  'special-background-color',
  'focus-color',
];

export const THEME_ATTRS_LIST = [
  'color',
  'background-color',
  'special-color',
  'outline-color',
  'outline-width',
  'border-color',
  'border-radius',
  'border-width',
  'shadow-color',
  'shadow-intensity',
  'animation-time',
  'heading-color',
  'hover-color',
  'focus-color',
];

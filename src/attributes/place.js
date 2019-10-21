import { excludeMod, hasMod } from '../helpers';

export const PLACE_VALUES = [
  'content', 'items', 'self'
].map((name) => {
  return CSS.supports(`place-${name}`, 'stretch stretch')
    ? function (val) {
      return {
        [`place-${name}`]: val,
      };
    } : function (val) {
      const values = val && val.trim().split(/\s+/);

      return val ? {
        [`align-${name}`]: values[0],
        [`justify-${name}`]: values[1] || values[0],
      } : null;
    };
});

const PLACE_ABS_OUTSIDE = [
  'outside-top', 'outside-right', 'outside-bottom', 'outside-left',
];

const PLACE_ABS_CENTER = [
  'center-top', 'center-right', 'center-bottom', 'center-left',
];

const PLACE_ABS_CENTER_STYLES = {
  'center-top': { y: '-50%' },
  'center-right': { x: '50%' },
  'center-bottom': { y: '50%' },
  'center-left': { x: '-50%' },
};

const PLACE_ABS_INSIDE = [
  'top', 'right', 'bottom', 'left',
];

const PLACE_ABS = [
  'inside',
  'cover',
  'fixed',
  ...PLACE_ABS_INSIDE,
  ...PLACE_ABS_OUTSIDE,
  ...PLACE_ABS_CENTER,
];

const FILL_STYLES = [{
  'min-width': '100%',
  'min-height': '100%',
  'align-self': 'stretch',
  'justify-self': 'stretch',
}, {
  $suffix: ':not([radius])',
  '--nu-border-radius': '0',
}, {
  $suffix: ':not([border])',
  'border': 'none',
  '--nu-border-shadow': 'inset 0 0 0 0 var(--nu-theme-border-color)',
  '--nu-focus-inset': 'inset 0 0',
}];

const COVER_STYLES = {
  top: '0',
  right: '0',
  bottom: '0',
  left: '0',
};

export default function placeAttr(val) {
  if (!val) return;

  let pos = '';

  if (hasMod(val, 'relative')) {
    val = excludeMod(val, 'relative');

    pos = 'relative';
  }

  if (val.trim() === 'fill') {
    // copy FILL_STYLES
    return [FILL_STYLES[0], { ...FILL_STYLES[1] }, { ...FILL_STYLES[2] }];
  }

  const abs = PLACE_ABS.find(place => hasMod(val, place));

  if (abs) {
    const styles = {
      position: hasMod(val, 'fixed') ? 'fixed' : 'absolute',
    };
    let transX = 0;
    let transY = 0;

    if (val.trim() === 'cover') {
      return {
        ...styles,
        ...COVER_STYLES,
      };
    }

    PLACE_ABS_INSIDE.forEach((place, i) => {
      if (!hasMod(val, place)) return;

      styles[place] = '0';
      delete styles[PLACE_ABS_INSIDE[(PLACE_ABS_INSIDE.indexOf(place) + 2) % 4]];

      if (i % 2 && !styles.top && !styles.bottom) {
        styles.top = '50%';
      }

      if (i % 2 === 0 && !styles.left && !styles.right) {
        styles.left = '50%';
      }
    });

    PLACE_ABS_OUTSIDE.forEach((place, i) => {
      if (!hasMod(val, place)) return;

      styles[PLACE_ABS_INSIDE[(PLACE_ABS_OUTSIDE.indexOf(place) + 2) % 4]] = '100%';
      delete styles[PLACE_ABS_INSIDE[PLACE_ABS_OUTSIDE.indexOf(place)]];

      if (i % 2 && !styles.top && !styles.bottom) {
        styles.top = '50%';
      }

      if (i % 2 === 0 && !styles.left && !styles.right) {
        styles.left = '50%';
      }
    });

    PLACE_ABS_CENTER.forEach((place, i) => {
      if (!hasMod(val, place)) return;

      styles[PLACE_ABS_INSIDE[PLACE_ABS_CENTER.indexOf(place)]] = '0';
      delete styles[PLACE_ABS_INSIDE[(PLACE_ABS_CENTER.indexOf(place) + 2) % 4]];

      if (PLACE_ABS_CENTER_STYLES[place].x) {
        transX = PLACE_ABS_CENTER_STYLES[place].x;
      }

      if (PLACE_ABS_CENTER_STYLES[place].y) {
        transY = PLACE_ABS_CENTER_STYLES[place].y;
      }

      if (i % 2 && !styles.top && !styles.bottom) {
        styles.top = '50%';
      }

      if (i % 2 === 0 && !styles.left && !styles.right) {
        styles.left = '50%';
      }
    });

    if (hasMod(val, 'inside')) {
      if (!styles.left) {
        styles.left = '50%';
      }

      if (!styles.top) {
        styles.top = '50%';
      }
    }

    if (styles.left === '50%') {
      transX = '-50%';
    }

    if (styles.top === '50%') {
      transY = '-50%';
    }

    styles.transform = `translate(${transX}, ${transY})`;

    return styles;
  }

  if (pos) {
    const styles = PLACE_VALUES[2](val);

    styles.position = pos;

    return styles;
  } else {
    return PLACE_VALUES[2](val);
  }
};

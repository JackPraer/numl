import { computeStyles } from './helpers';
import { generateCSS } from './css';

export const RESPONSIVE_ATTR = 'responsive';
export const RESPONSIVE_MOD = 'responsive';

export function generateCSSByZones(Element, query, name, value, zones) {
  const values = value.split('|');

  return values.map((val, i) => {
    // if default value
    if (!val.trim()) return;

    const stls = computeStyles(name, val, Element.nuAllAttrs, Element.nuAllDefaults);

    return generateCSS(query, stls);
  });
}

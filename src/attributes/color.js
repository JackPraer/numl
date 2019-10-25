import { colorUnit } from '../helpers';

const backgroundUnit = colorUnit('background-color', 'background');
const baseColorUnit = colorUnit('color', 'text');

export default function colorAttr(val) {
  if (val == null) return;

  val = val.trim();

  switch (val) {
    case 'fill':
      return {
        color: 'var(--nu-theme-color)',
        'background-color': 'var(--nu-theme-background-color)',
      };
    case 'minor fill':
      return {
        color: 'var(--nu-theme-minor-color)',
        'background-color': 'var(--nu-theme-minor-background-color)',
      };
    case 'special fill':
      return {
        color: 'var(--nu-theme-special-color)',
        'background-color': 'var(--nu-theme-special-contrast-color)',
      };
    case 'swap':
      return {
        color: 'var(--nu-theme-background-color)',
        'background-color': 'var(--nu-theme-color)',
      };
    case 'minor swap':
      return {
        color: 'var(--nu-theme-minor-background-color)',
        'background-color': 'var(--nu-theme-minor-color)',
      };
    case 'special swap':
      return {
        color: 'var(--nu-theme-special-contrast-color)',
        'background-color': 'var(--nu-theme-special-color)',
      };
  }

  if (val.includes(' ')) {
    const tmp = val.split(/\s+/);

    return {
      ...baseColorUnit(tmp[0]),
      ...backgroundUnit(tmp[1]),
    };
  }

  return baseColorUnit(val);
}

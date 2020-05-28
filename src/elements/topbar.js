import NuElement from './element';

export default class NuTopBar extends NuElement {
  static get nuTag() {
    return 'nu-topbar';
  }

  static get nuStyles() {
    return {
      display: 'block',
      place: 'fixed top',
      fill: 'bg',
      shadow: '0 :sticky[1]',
      width: '100%',
      z: 'front',
      border: 'bottom',
      transition: 'all',
    };
  }
}

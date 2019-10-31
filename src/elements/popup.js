import NuCard from './card';

export default class NuPopup extends NuCard {
  static get nuTag() {
    return 'nu-popup';
  }

  static get nuRole() {
    return 'dialog';
  }

  static get nuDefaults() {
    return {
      shadow: '',
      z: 'front',
      opacity: '0 ^:pressed[1]',
      transition: 'opacity',
      place: 'outside-bottom',
      border: '1x outside',
      width: '100%',
      mod: 'wrap',
      theme: 'default',
    };
  }

  nuConnected() {
    super.nuConnected();

    this.nuSetMod('popup', true);
    this.parentNode.nuSetAria('haspopup', true);

    this.addEventListener('mousedown', (event) => {
      event.nuPopup = this;

      event.stopPropagation();
      event.preventDefault();
    });

    this.addEventListener('click', (event) => {
      event.nuPopup = this;

      event.stopPropagation();
      event.preventDefault();
    });

    this.nuClose();

    this.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        this.parentNode.nuSetPressed(false);
      }
    });
  }

  nuOpen() {
    this.style.display = this.getAttribute('display')
      || this.constructor.nuAllDefaults.display;
    this.parentNode.nuSetAria('expanded', true);

    const activeElement = this.querySelector('[tabindex]:not([tabindex="-1"]');

    if (activeElement) activeElement.focus();
  }

  nuClose() {
    this.style.display = 'none';
    this.parentNode.nuSetAria('expanded', false);

    const expandedElements = [...this.querySelectorAll('[aria-expanded="true"]')];

    expandedElements.forEach(el => {
      el.nuSetPressed(false);
    });
  }
}

function findParentPopup(element) {
  const elements = [];

  do {
    if (element.hasAttribute && element.hasAttribute('aria-haspopup')) {
      elements.push(element.querySelector('[nu-popup]'));
    }
  } while (element = element.parentNode);

  return elements;
}

function handleOutside(event) {
  const popups = event.nuPopup || findParentPopup(event.target);

  [...document.querySelectorAll('[nu-popup]')]
    .forEach((currentPopup) => {
      if (!popups.includes(currentPopup)) {
        currentPopup.parentNode.nuSetPressed(false);
      }
    });
}

window.addEventListener('mousedown', handleOutside);
window.addEventListener('focusin', handleOutside);

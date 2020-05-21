import WidgetBehavior, { ALIAS_ATTR } from "./widget";
import Routing from '../routing';
import { h, isEqual, queryById } from '../helpers';
import { handleLinksState } from '../links';

export default class ButtonBehavior extends WidgetBehavior {
  static get params() {
    return {
      input: true,
    };
  }

  init() {
    this.value = null;
    this.offValue = null;
    // require mixins
    this.require('active', 'focusable');

    const pressedAttr = ALIAS_ATTR(this.host, 'pressed');

    this.props.to = null;
    this.props.pressed = (bool) => this.set(bool != null, true);
    this.props.checked = pressedAttr;
    this.props.selected = pressedAttr;

    this.setMod('btn', true);

    super.init();

    const { host } = this;

    host.nuButton = this;

    this.on('keydown', (event) => {
      if (event.key === 'Escape' && host.nuHasAria('expanded')) {
        this.set(false);
      }
    });

    this.on('tap', (event) => {
      if (!event.nuRole && this.role) {
        event.nuRole = this.role;
      }
    });

    /**
     * @type {RadioGroupBehavior}
     */
    this.radioGroup = null;

    if (this.to) {
      this.changed('to', this.to);
    }
  }

  connected() {
    super.connected();

    const { host } = this;

    this.linkContext('radiogroup', () => this.verifyRadioGroup(), 'radioGroup');

    if (this.role === 'button') {
      if (this.to) {
        this.role = 'link';
      }
    }

    this.createLink();

    host.nuSetContext('button', this);
  }

  changed(name, value) {
    super.changed(name, value);

    if (name === 'to') {
      this.createLink();

      const { $link } = this;

      if ($link) {
        $link.href = this.href;
        $link.target = this.newTab ? '_blank' : '_self';
      }
    }
  }

  verifyRadioGroup() {
    const radioGroup = this.radioGroup;

    if (!radioGroup) return;

    this.setAttr('link-value', '');
    this.role = radioGroup.params.itemRole;

    if (this.value == null) {
      if (!radioGroup.counter) radioGroup.counter = 0;

      this.setValue(String(radioGroup.counter++));
    }

    this.fromContextValue(radioGroup.value);
  }

  linkPopup(popup) {
    if (this.popup) return;

    const { host } = this;

    this.popup = popup;
    host.nuSetAria('haspopup', true);
    host.nuSetAria('expanded', this.pressed || false);
    this.role = 'button';
  }

  unlinkPopup(popup) {
    if (this.popup !== popup) return;

    const { host } = this;

    delete this.popup;
    host.nuSetAria('haspopup', null);
    host.nuSetAria('expanded', null);
    this.role = this.host.constructor.nuRole;
  }

  createLink() {
    const { host } = this;

    let $link;

    if (!this.to) {
      if (this.$link) {
        delete this.$link;
        host.removeChild(this.$link);
      }

      return;
    }

    if (!this.$link) {
      $link = h('a');

      $link.href = this.href;
      $link.target = this.newTab ? '_blank' : '_self';
      $link.setAttribute('tabindex', '-1');
      $link.setAttribute('aria-labelledby', host.nuUniqId);

      this.$link = $link;

      setTimeout(() => host.appendChild(this.$link));

      this.$link.addEventListener('click', (evt) => {
        if (this.disabled) {
          evt.preventDefault();
          return;
        }

        if (evt.button === 0 && !this.disabled) {
          this.tap(evt);
        }

        evt.stopPropagation();
      });
    } else {
      $link = this.$link;
    }

    $link.href = this.href;
    $link.target = this.newTab ? '_blank' : '_self';

    if (($link && $link.href).includes('//')) {
      this.$link.setAttribute('rel', 'noreferrer');
    } else {
      this.$link.removeAttribute('rel');
    }
  }

  tap(evt) {
    const { host } = this;

    if (this.to && evt.target !== this.$link) {
      this.$link.click();

      return;
    }

    if (this.to && evt.target === this.$link) {
      if (this.href.startsWith('#')) {
        const id = this.href.slice(1);
        const elm = queryById(host, id);

        if (elm) {
          elm.scrollIntoView();

          evt.preventDefault();

          handleLinksState(true);

          return;
        }
      }
    }

    if (this.disabled
      || host.getAttribute('tabindex') === '-1') return;

    if (this.scrollto) {
      host.nuScrollTo(this.scrollto);
    }

    if (this.to) {
      const to = this.to;
      const href = to.replace(/^!/, '');
      const openNewTab = to.startsWith('!') || evt.metaKey || evt.shiftKey;
      const useLink = Routing.route(href, openNewTab);

      if (!useLink) {
        evt.preventDefault();
        evt.stopPropagation();
      }

      this.doAction('close', true);
    }

    setTimeout(() => {
      this.emit('tap');
    }, 0);

    if (this.isToggle()) {
      this.toggle();
    } else {
      if (!this.popup) {
        this.control();
      }

      this.doActions(this.value);
    }
  }

  get emitValue() {
    if (this.isToggle()) {
      if (this.value != null) {
        return this.pressed ? this.value : (this.offValue != null ? this.offValue : this.value);
      }

      return this.pressed;
    }

    return this.value;
  }

  toggle() {
    if (!this.isToggle()) return;

    if (this.pressed && !this.isUnpressable()) {
      return;
    }

    this.set(!this.pressed);
  }

  set(pressed, silent) {
    if (pressed === this.pressed) return;

    if (!this.isToggle()) return;

    const { host } = this;

    pressed = pressed || false;

    this.pressed = pressed;

    if (this.isRadio()) {
      host.nu('focusable')
        .then(Focusable => Focusable.set(!pressed && !this.disabled));
    }

    if (this.popup) {
      host.nuSetAria('expanded', pressed);
    } else if (this.isCheckbox()) {
      host.nuSetAria('checked', pressed);
    } else if (this.isSelectable()) {
      host.nuSetAria('selected', pressed);
    } else {
      host.nuSetAria('pressed', pressed);
    }

    if (!silent && this.isCheckbox()) {
      this.emit('pressed', this.pressed);
      this.emit('input', this.emitValue);
    }

    if (!this.popup) {
      this.control();
    }

    host.nuSetMod('pressed', pressed);

    if (pressed) {
      this.doActions(this.value);
    }

    this.toggleInnerPopup();
  }

  toggleInnerPopup(bool) {
    const innerPopup = this.host.nuDeepQuery('[is-popup]');
    const method = bool == null
      ? (this.pressed ? 'open' : 'close')
      : (bool ? 'open' : 'close');

    if (innerPopup) {
      innerPopup.nuPopup[method]();
    }
  }

  setValue(value, silent) {
    this.toggleInnerPopup(false);

    super.setValue(value, silent);
  }

  setByValue(val) {
    let value = this.value;
    let offValue = this.offValue;

    if (value != null) {
      value = this.getTypedValue(value);

      if (isEqual(value, val)) {
        return this.set(true);
      }

      if (offValue != null) {
        offValue = this.getTypedValue(offValue);

        if (offValue === val) {
          return this.set(false);
        }
      }

      return this.set(false);
    }

    this.set(val != null);
  }

  isToggle() {
    const { host } = this;

    return host.nuHasAria('pressed')
      || host.nuHasAria('expanded')
      || host.nuHasAria('checked')
      || host.nuHasAria('selected')
      || ['checkbox', 'radio', 'tab', 'switch'].includes(this.role);
  }

  isUnpressable() {
    return !['radio', 'tab'].includes(this.role);
  }

  isRadio() {
    return ['radio', 'tab'].includes(this.role);
  }

  isSelectable() {
    return ['tab'].includes(this.role);
  }

  isCheckbox() {
    return ['radio', 'checkbox', 'switch'].includes(this.role);
  }

  fromContextValue(value) {
    if (!this.isToggle() || value == null) return;

    this.set(isEqual(this.value, value));
  }

  control() {
    let value = true;

    if (this.isToggle() && !this.valueBubbled) {
      value = !!this.pressed;
    }

    this.nu('control')
      .then(Control => Control.apply(value, this.getTypedValue(this.emitValue)));
  }

  get href() {
    const { to = '' } = this;

    return to.replace(/^!/, '');
  }

  get newTab() {
    const { to = '' } = this;

    return to.startsWith('!');
  }
}

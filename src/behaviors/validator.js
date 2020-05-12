import WidgetBehavior from './widget';
import { getRealHeight, setTransitionTimeout, setImmediate } from '../helpers';

export default class ValidatorBehavior extends WidgetBehavior {
  static get params() {
    return {
      primary: true,
      linkValue: false,
      linkHostValue: false,
    };
  }

  init() {
    this.props.for = (val) => {
      this.fieldId = val;
    };
    this.props.assert = (assert) => {
      if (assert) {
        const tmp = assert.split(':');
        this.assert = tmp[0];
        this.assertValue = tmp[1];
      } else {
        this.assert = null;
      }
    };

    super.init();
  }

  get field() {
    return this.host.getAttribute('for').trim();
  }

  connected() {
    this.linkContext('form', (form) => {
      if (this.currentForm && form !== this.currentForm) {
        this.disconnectForm(this.currentForm, !!form);
      }

      this.currentForm = form;

      if (!form) return;

      this.connectForm();
    });
  }

  changed(name, value) {
    super.changed(name, value);

    if (this.form) {
      this.connectForm();
    }
  }

  connectForm() {
    const { fieldId, assert, form, assertValue } = this;

    if (!fieldId || !assert || !form) return;

    this.form.registerCheck(fieldId, this, assert, assertValue);
  }

  disconnectForm(form = this.currentForm, dontDelete) {
    const { fieldId, assert } = this;

    if (!fieldId || !assert) return;

    form.unregisterCheck(fieldId);

    if (!dontDelete) {
      delete this.form;
    }
  }

  setValidity(bool) {
    const { host } = this;

    if (this.validity === bool) return;

    super.setValidity(bool);

    const realHeight = getRealHeight(host);

    if (!bool) {
      host.style.maxHeight = '0px';
      host.offsetHeight;
      host.style.maxHeight = `${realHeight}px`;

      setTransitionTimeout(host, () => {
        host.style.maxHeight = '';
      });
    } else {
      host.style.maxHeight = `${realHeight}px`;
      host.offsetHeight;
      host.style.maxHeight = '0px';
    }
  }
}

import NuFlow from './flow';

export default class NuForm extends NuFlow {
  static get nuTag() {
    return 'nu-form';
  }

  static get nuBehaviors() {
    return {
      form: true,
    };
  }

  set value(val) {
    if (this.nuSetValue) {
      this.nuSetValue(val, true);
    } else {
      this._value = val;
    }
  }

  get value() {
    return this.nuGetValue ? this.nuGetValue() : this._value;
  }
}

import ComponentBehavior from './component.js';

export default class DatePickerBehaviour extends ComponentBehavior {
  static get params() {
    return {
      input: true,
      localized: true,
      component: 'datepicker',
      provider: false,
    };
  }
}

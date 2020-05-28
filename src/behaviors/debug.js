import Behavior from './behavior';
import { query } from '../helpers';

let counter = 0;

export default class DebugBehavior extends Behavior {
  constructor(host, value) {
    super(host, value);

    this.debuggerId = value;
  }

  connected() {
    this.connect();

    this.log('connected');
  }

  changed(name, value) {
    this.log('changed', { name, value });
  }

  disconnected() {
    this.log('disconnected');
  }

  connect() {
    const debugEl = this.getDebugger();

    if (!debugEl) return;

    debugEl.nu('component').then(Debug => {
      Debug.componentPromise.then(() => {
        if (!this.host.nuDebugId) {
          const debugId = `el${++counter}`;

          window[debugId] = this.host;

          this.host.nuDebugId = debugId;
        }

        Debug.set({ target: this.host });
      });
    });
  }

  getDebugger() {
    const { host } = this;
    const id = this.debuggerId;

    if (!id) return;

    if (this.debugger && this.debugger.nuId === id) {
      return this.debugger;
    }

    const debugEl = query(host, `#${id}`);

    if (debugEl && debugEl.nu) {
      this.debugger = debugEl;

      return debugEl;
    }
  }

  log(event, detail) {
    const debugEl = this.getDebugger();

    if (!debugEl) return;

    debugEl.nu('component').then(Debug => {
      Debug.componentPromise.then(() => {
        Debug.component.log(event, detail);
      });
    });
  }
}

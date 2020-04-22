export default class Behavior {
  constructor($host) {
    this.$host = $host;
    this.$ref = $host.nuRef || $host;
  }

  nu(name) {
    return this.$host.nu(name);
  }

  get context() {
    return this.$host.nuContext;
  }
}

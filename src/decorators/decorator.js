import { generateNuId } from '../helpers';
import NuBase from '../base';

export default class NuDecorator extends NuBase {
  constructor() {
    super();
  }

  nuMounted() {
    if (!this.parentNode) return;

    this.nuParentId = generateNuId(this.parentNode);
  }

  get nuParentContext() {
    return `[data-nu-id="${this.nuParentId}"]`;
  }
}

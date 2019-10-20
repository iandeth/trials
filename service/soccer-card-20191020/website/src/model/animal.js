const Promise = kzs.Promise;
const $ = kzs.$;

export default class {
  constructor() {
    this.voice = undefined;
  }

  bark() {
    kzs.console.log('#bark called');
    return this.voice;
  }
}

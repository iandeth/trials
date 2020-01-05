export default class Animal {
  constructor() {
    this.voice = undefined;
  }

  bark() {
    console.log('#bark called');
    return this.voice;
  }
}

import Animal from 'model/animal';

const Promise = kzs.Promise;
const $ = kzs.$;

export default class extends Animal {
  constructor() {
    super();
    this.voice = 'bow wow!';
  }
}

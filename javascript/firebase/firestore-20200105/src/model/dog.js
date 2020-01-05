import Animal from 'model/animal';

export default class extends Animal {
  constructor() {
    super();
    this.voice = 'bow wow!';
  }
}

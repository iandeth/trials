import Animal from 'js/model/animal';

export default class Dog extends Animal {
  constructor() {
    super();
    this.voice = 'bow wow!';
  }
}

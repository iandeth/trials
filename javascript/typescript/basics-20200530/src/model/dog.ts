import Animal from "./animal";

export default class Dog extends Animal {
  constructor(name: string) {
    super(name, 4);

    // readonly error
    //this.legs = 4;
  }
}

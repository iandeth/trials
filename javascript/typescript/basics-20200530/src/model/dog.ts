import Animal from "src/model/animal";

export default class Dog extends Animal {
  constructor(name: string) {
    super(name, 4);

    // readonly error
    //this.legs = 4;
  }

  bark() {
    console.log("bow wow");
  }
}

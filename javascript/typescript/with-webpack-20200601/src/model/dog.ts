import Animal from "src/model/animal";

export default class Dog extends Animal {
  constructor(name: string) {
    super(name, 4);
    // ts: readonly error
    //this.legs = 4;
  }

  bark(): string {
    // ts: no-unused-vars warning
    //const foo = 1;
    return "bow wow";
  }
}

import Animal from "src/model/animal";

export default class Cat extends Animal {
  constructor(name: string) {
    super(name, 4);
  }

  bark(): void {
    console.log("mew");
  }
}

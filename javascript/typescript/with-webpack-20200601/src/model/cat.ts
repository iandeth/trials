import Animal from "src/model/animal";

export default class Cat extends Animal {
  constructor(name: string) {
    super(name, 2);
  }

  bark(): string {
    return "mew";
  }
}

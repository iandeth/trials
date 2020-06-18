export default abstract class Animal {
  // instance property
  name: string;

  // define property shortcut (only works with readonly): legs
  constructor(name: string, readonly legs: number) {
    this.name = name;
  }

  move(steps = 1): { steps: number; legs: number } {
    return { steps: steps, legs: this.legs };
  }

  abstract bark(): string;
}

export default abstract class Animal {
  // instance property
  //readonly legs: number;

  // define property shortcut
  constructor(readonly name: string, readonly legs: number) {}

  move(steps = 1): { steps: number; legs: number } {
    console.log(`moving ${steps} steps with ${this.legs} legs`);
    return { steps: steps, legs: this.legs };
  }
}

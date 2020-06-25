export default class TimelineMessage {
  constructor(text, hilight = false) {
    this.fixtures = [
      "foo",
      "bar",
      "buz",
      "quux",
      "quuz",
      "corge",
      "grault",
      "garply",
      "waldo",
      "fred",
    ];
    this.hilight = hilight;
    if (text === "_RANDOM_") this.text = this._createRandomText();
    else this.text = text;
  }

  render() {
    if (this.text === "") return;
    const c = this.hilight ? 'class="hilight"' : "";
    return $(`<li ${c}>${this.text}</li>`);
  }

  // private methods
  _createRandomText() {
    // via https://stackoverflow.com/a/4550514
    return this.fixtures[Math.floor(Math.random() * this.fixtures.length)];
  }
}

import TimelineMessage from "src/timeline-message";

export default class Timeline {
  constructor() {
    this.tl = undefined; // timeline dom root
  }

  run(auto = true) {
    $(() => {
      this.tl = $("#timeline");
      if (auto) this._autoAdd();
      this._initSendUI();
    });
  }

  // private methods
  _autoAdd() {
    // via https://stackoverflow.com/a/6962808
    const loop = () => {
      // random 500 to 2000
      const rand = Math.round(Math.random() * (2000 - 500)) + 500;
      setTimeout(() => {
        this._addMessage("_RANDOM_");
        loop();
      }, rand);
    };
    loop();
  }

  _initSendUI() {
    $("#msg-button").on("click", () => {
      const text = $("#msg-input").val().trim();
      if (text === "") return;
      this._addMessage(text, true);
    });
  }

  _addMessage(text, hilight = false) {
    const msg = new TimelineMessage(text, hilight);
    this.tl.append(msg.render());
  }
}

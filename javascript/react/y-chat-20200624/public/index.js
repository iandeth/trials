"use strict";

class Timeline {
  constructor() {
    this.tl = undefined; // timeline dom root
  }

  run(auto = true) {
    $(() => {
      this.tl = $("#timeline");
      if (auto) {
        this._autoAdd();
      }
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

class TimelineMessage {
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

class Reactions {
  run(auto = true) {
    $(() => {
      if (auto) {
        this._autoAdd();
        this._autoAdd();
        this._autoAdd();
      }
      this._initSendUI();
    });
  }

  // private methods
  _autoAdd() {
    const loop = () => {
      // random 100 to 2000
      const rand = Math.round(Math.random() * (2000 - 100)) + 100;
      setTimeout(() => {
        new ReactionIcon().render("random", "wide");
        loop();
      }, rand);
    };
    loop();
  }

  _initSendUI() {
    $("#send-reaction").on("click", () => {
      new ReactionIcon().render("laugh", "narrow");
      return false;
    });
  }
}

class ReactionIcon {
  constructor() {
    this.imgs = ["laugh", "heart"];
  }

  render(type = "laugh", ypos = "wide") {
    if (type === "random")
      type = this.imgs[Math.floor(Math.random() * this.imgs.length)];

    const src = `icon-${type}.png`;
    const $img = $(`<img src="${src}" class="reaction-icon" />`);
    // ランダム位置で配置
    this._setRandomXPos($img);
    this._setRandomYPos($img, ypos);
    $("body").append($img);

    // 上に移動するアニメーション
    setTimeout(() => $img.css("bottom", "90%"), 100);
    setTimeout(() => $img.remove(), 2000);
  }

  // private methods
  _setRandomXPos($img) {
    // random 5 to 40
    const int = Math.round(Math.random() * (40 - 5)) + 5;
    $img.css("right", `${int}%`);
  }

  _setRandomYPos($img, range = "wide") {
    let int;
    if (range === "wide")
      // random 10 to 80
      int = Math.round(Math.random() * (80 - 10)) + 10;
    else if (range === "narrow")
      // random 10 to 30
      int = Math.round(Math.random() * (30 - 10)) + 10;
    else throw new Error(`unknown range: ${range}`);
    $img.css("bottom", `${int}%`);
  }
}

class Controller {
  run() {
    this._runTimeline();
    this._runReactions();
  }

  // private methods
  _runTimeline() {
    let auto = true;
    const p = window.location.search;
    if (p.match(/tl=0/)) auto = false;
    new Timeline().run(auto);
  }

  _runReactions() {
    let auto = true;
    const p = window.location.search;
    if (p.match(/re=0/)) auto = false;
    new Reactions().run(auto);
  }
}

// main scope
new Controller().run();

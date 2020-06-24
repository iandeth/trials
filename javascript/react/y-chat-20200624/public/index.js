"use strict";

class TimelineController {
  constructor() {
    this.tl = undefined; // timeline dom root
    this.msgFixtures = [
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
  }

  run() {
    $(() => {
      this.tl = $("#timeline");
      this._addRandomMsgs();
      this._initSendUI();
    });
  }

  // private methods
  _addRandomMsgs() {
    // via https://stackoverflow.com/a/6962808
    const loop = () => {
      // random 500 to 2000
      const rand = Math.round(Math.random() * (2000 - 500)) + 500;
      setTimeout(() => {
        const msg = this._createRandomMsg();
        this._addMsg(msg);
        loop();
      }, rand);
    };
    loop();
  }

  _initSendUI() {
    $("#msg-button").on("click", () => {
      const msg = $("#msg-input").val().trim();
      if (!msg) return;
      this._addMsg(msg, true);
    });
  }

  _addMsg(msg, hilight = false) {
    const c = hilight ? 'class="hilight"' : "";
    this.tl.append(`<li ${c}>${msg}</li>`);
  }

  _createRandomMsg() {
    // via https://stackoverflow.com/a/4550514
    return this.msgFixtures[
      Math.floor(Math.random() * this.msgFixtures.length)
    ];
  }
}

class ReactionController {
  run() {
    $(() => {
      this._initSendUI();
    });
  }

  // private methods
  _initSendUI() {
    $("#send-reaction").on("click", () => {
      new ReactionIcon().init();
      return false;
    });
  }
}

class ReactionIcon {
  constructor() {
    this.src = "icon-laugh.png";
  }

  init() {
    const $img = $(`<img src="${this.src}" class="reaction-icon" />`);
    // ランダム位置で配置
    this._setRandomXPos($img);
    this._setRandomYPos($img, "narrow");
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

// main scope
new TimelineController().run();
new ReactionController().run();

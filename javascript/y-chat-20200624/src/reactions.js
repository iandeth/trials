import ReactionIcon from "src/reaction-icon";

export default class Reactions {
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

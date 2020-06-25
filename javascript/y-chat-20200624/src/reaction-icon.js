export default class ReactionIcon {
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

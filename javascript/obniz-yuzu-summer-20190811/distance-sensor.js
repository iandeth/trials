"use strict";
console.log("ver 2021-08-22-01");

// https://obniz.io/ja/sdk/parts/HC-SR04/README.md
class DistanceSensor {
  constructor(ui) {
    this.obniz = new Obniz("9207-0920");
    this.partsOpt = { gnd: 0, echo: 1, trigger: 2, vcc: 3 };
    this.sensor = undefined;
    this.ui = ui;
  }

  init() {
    this.obniz.onconnect = async () => {
      var d = this.obniz.display;
      d.clear();
      d.print("DistanceSensor");

      this._initSensor();

      this._startMonitoring();
    };
  }

  // private methods
  _initSensor() {
    this.sensor = this.obniz.wired("HC-SR04", this.partsOpt);
  }

  _startMonitoring() {
    var i = 0;
    var bases = [];
    var baseDist;

    // 初期化ボタン
    $("#resetBtn").on("click", () => {
      i = 0;
      baseDist = "";
      bases = [];
      console.log("初期化");
    });

    // 計測ループ
    this.obniz.repeat(async () => {
      var df = await this.sensor.measureWait();
      var d = Math.floor(df / 10); // mm to cm

      // 最初の 5 回は基準距離を判定
      if (i < 5) {
        bases.push(d);
        if (i == 4) {
          baseDist = this._resolveBaseDist(bases);
          if (!baseDist) {
            // 計測不能だった場合は再計測
            console.error("baseDist not resolved, retry");
            i = 0;
            bases = [];
            return;
          }
          console.log("base dist is:", baseDist, bases);
        }
        i++;
        return;
      }

      if (d < baseDist) {
        console.log("alertShow", baseDist, d);
        this.ui.alertShow();
      } else {
        this.ui.alertHide();
      }

      i++;
      await this.obniz.wait(200);
    });
  }

  _resolveBaseDist(bases) {
    var baseDist = bases.reduce((sum, v) => {
      if (!v) return sum;
      return sum + v;
    });
    if (!baseDist) return;
    return (Math.floor(baseDist / bases.length) / 10) * 10;
  }
}

class UI {
  alertShow() {
    $("#alert").show(100);
  }

  alertHide() {
    $("#alert").hide(100);
  }
}

// メインの処理
var ui = new UI();
new DistanceSensor(ui).init();

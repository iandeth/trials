'use strict';
console.log('ver 20190811-01');

// https://obniz.io/ja/sdk/parts/HC-SR04/README.md
class DistanceSensor {
  constructor() {
    this.obniz = new Obniz("9207-0920");
    this.partsOpt = { gnd:5, echo:6, trigger:7, vcc:8 };
    this.sensor = undefined;
  }

  init() {
    this.obniz.onconnect = async ()=> {
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
    var prev = 0;
    this.obniz.repeat(async ()=> {
      var df = await sonar.measureWait(); // distance in float
      var d = Math.floor(df / 10);
      console.log(`distance: ${d} cm`);

      if(this._isNearDistance(prev, d, 20) == false) {
        console.log('is far distance');
      }

      prev = d;
      await obniz.wait(200);
    });
  }

  _isNearDistance(prev = 0, now = 0, allowDiff = 20) {
    if(prev == 0) return true;

    // round 1st digit
    var p = Math.round(prev / 10) * 10;
    var n = Math.round(now / 10) * 10;

    // true if diff is within N cm
    return (Math.abs(p - n) <= allowDiff)? true : false;
  }
}

class UI {
  constructor(ds) {
    this.distanceSensor = ds;
  }

  init() {
    $(()=> {
    });
  }
}

// main scope
var md = new DistanceSensor();
md.init();

new UI(md).init();

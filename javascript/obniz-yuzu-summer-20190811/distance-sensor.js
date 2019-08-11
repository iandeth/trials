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
    var i = 0;
    var bases = [];
    var baseDist;
    this.obniz.repeat(async ()=> {
      var df = await this.sensor.measureWait(); // distance in float
      var d = Math.floor(df / 10); // mm to cm

      // 最初の 5 回は基準距離を判定
      if(i < 5) {
        bases.push(d);
        if(i == 4) {
          baseDist = bases.reduce((sum, v)=> {
            if(!v) return sum;
            return sum + v;
          })
          if(!baseDist) {
            console.error('baseDist not resolved, retry');
            i = 0; bases = []; return;
          }
          baseDist = Math.floor(baseDist / bases.length / 10) * 10;
          console.log('base dist is:', baseDist, bases);
        }
        i++;
        return;
      }

      if(d < baseDist) {
        console.log('close distance', baseDist, d);
        $('#alert').show(200);
      } else {
        $('#alert').hide(200);
      }

      i++;
      await this.obniz.wait(200);
    });
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

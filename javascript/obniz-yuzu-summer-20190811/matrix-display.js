'use strict';
console.log('ver 20190811-01');

// https://obniz.io/ja/sdk/parts/MatrixLED_MAX7219/README.md
// JS canvas API: https://mzl.la/2YVip7I
class MatrixDisplay {
  constructor() {
    this.obniz = new Obniz("9207-0920");
    this.partsOpt = { clk:0, cs:1, din:2, gnd:3, vcc:4 };
    this.font = "9px sans-serif";

    this.matrix = undefined;
    this.canvas = undefined;
    this.tickerId = undefined; // setInterval id
  }

  init() {
    this.obniz.onconnect = async ()=> {
      var d = this.obniz.display;
      d.clear();
      d.print("MatrixDisplay");

      this._initMatrix();

      $(()=> {
        var text = $('#text').val();
        this.fillText(text);
      });
    };
  }

  fillText(text, leftPos) {
    this._clearTicker();
    this._fillText(text, leftPos);
  }

  fillTextAsTicker(text = 'hello', intv = 50) { // interval milli seconds
    this._clearTicker();
    var tw = Math.round(this.canvas.measureText(text).width);
    var pos = this.matrix.width;

    this.tickerId = setInterval(()=> {
      if(pos < tw * -1)
        pos = this.matrix.width; // 左端に消えたら開始位置に戻す

      this._fillText(text, pos);
      pos--;
    }, intv);
  }

  // private methods
  _initMatrix() {
    var m = this.obniz.wired("MatrixLED_MAX7219", this.partsOpt);
    m.init(8 * 4, 8);
    m.brightness(1); // 0 - 15
    m.clear();
    this.matrix = m;

    var c = this.obniz.util.createCanvasContext(m.width, m.height);
    c.font = this.font;
    this.canvas = c;
  }

  _fillText(text = 'hello', leftPos = 0) {
    var m = this.matrix;
    var c = this.canvas;

    c.fillStyle = "black";
    c.fillRect(0, 0, m.width, m.height);

    c.fillStyle = "white";
    c.fillText(text, leftPos, 7);
    m.draw(c);
  }

  _clearTicker() {
    if(!this.tickerId) return;
    clearInterval(this.tickerId);
  }

}

class RailsInfo {
  constructor() {
    this.lastInfo = undefined;
  }
  fetch() {
    return this._fetch()
      .then((lines)=> this._parse(lines));
  }

  _fetch() {
    // via https://rti-giken.jp/fhc/api/train_tetsudo/
    var url = 'https://tetsudo.rti-giken.jp/free/delay.json';
    return new Promise((resolve, reject)=> {
      $.getJSON(url, (lines)=> {
        if(lines instanceof(Array) == false) {
          console.error('json is not array', lines, url);
          return reject();
        }
        resolve(lines);
      });
    });
  }

  _parse(lines) {
    lines.forEach((r)=> {
      r.upd = new Date(r.lastupdate_gmt * 1000);
    });
    console.log('#_parse', lines);
    this.lastInfo = lines;

    var str = lines.map((v) => v.name).join('、');
    return Promise.resolve(str);
  }
}

class UI {
  constructor(md) {
    this.matrixDisplay = md;
  }

  init() {
    var md = this.matrixDisplay;
    $(()=> {
      $('#applyTextBtn').click(()=> {
        var text = $('#text').val();
        var asTicker = $('#ticker').prop('checked');
        if(asTicker)
          md.fillTextAsTicker(text);
        else
          md.fillText(text);
      });

      $('#showRailsInfo').click(()=> {
        var rs = new RailsInfo();
        rs.fetch().then((text)=> {
          md.fillTextAsTicker(text);
          var $ul = $('ul#railsInfo');
          $ul.find('li').remove();
          rs.lastInfo.forEach((r)=> {
            var upd = r.upd.toLocaleString();
            $(`<li>${upd} ${r.company} <b>${r.name}</b></li>`).appendTo($ul);
          });
        });
      });
    });
  }
}

// main scope
var md = new MatrixDisplay();
md.init();

new UI(md).init();

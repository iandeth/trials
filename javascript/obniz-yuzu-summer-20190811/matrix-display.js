'use strict';
console.log('ver 20190812-01');

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
    var r = this._createMatrixAndCanvasInstance(this.partsOpt);
    this.matrix = r.matrix;
    this.canvas = r.canvas;
  }

  _createMatrixAndCanvasInstance(opt) {
    var m = this.obniz.wired("MatrixLED_MAX7219", opt);
    m.init(8 * 4, 8);
    m.brightness(10); // 0 - 15
    m.clear();

    var c = this.obniz.util.createCanvasContext(m.width, m.height);
    c.font = this.font;

    return { matrix:m, canvas:c };
  }

  _fillText(text = 'hello', leftPos = 0) {
    this._fillTextWithMatrix(this.matrix, this.canvas, text, leftPos);
  }

  _fillTextWithMatrix(matrix, canvas, text = 'hello', leftPos = 0, baselinePos = 7) {
    var m = matrix;
    var c = canvas;

    c.fillStyle = "black";
    c.fillRect(0, 0, m.width, m.height);

    c.fillStyle = "white";
    c.fillText(text, leftPos, baselinePos);
    m.draw(c);
  }

  _clearTicker() {
    if(!this.tickerId) return;
    clearInterval(this.tickerId);
  }
}

class MatrixDisplayDouble extends MatrixDisplay {
  constructor() {
    super();
    //this.font = "16px sans-serif";
    //this.font = "16px Courier New";
    //this.font = "16px Noto Sans CJK JP Bold";
    this.font = "16px VL Gothic";
    this.partsOpt2 = { clk:5, cs:6, din:7, gnd:8, vcc:9 };
    this.matrix2 = undefined;
    this.canvas2 = undefined;
  }

  _initMatrix(opt) {
    super._initMatrix();

    // 二つ目の matrix/canvas set を作成
    var r = this._createMatrixAndCanvasInstance(this.partsOpt2);
    this.matrix2 = r.matrix;
    this.canvas2 = r.canvas;
  }

  _fillText(text = 'hello', leftPos = 0) {
    // 二つの matrix に描画
    [
      { m:this.matrix, c:this.canvas, baseline:14 },
      { m:this.matrix2, c:this.canvas2, baseline:6 }
    ].forEach((r)=> {
      this._fillTextWithMatrix(r.m, r.c, text, leftPos, r.baseline);
    });
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
        if(asTicker) {
          var intv = $('#tickerIntv').val() || 50;
          md.fillTextAsTicker(text, intv);
        } else {
          md.fillText(text);
        }
      });

      $('#showRailsInfo').click(()=> {
        var rs = new RailsInfo();
        rs.fetch().then((text)=> {
          var intv = $('#tickerIntv').val() || 50;
          md.fillTextAsTicker(text, intv);

          // HTML 側にも結果表示
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
//var md = new MatrixDisplay();
var md = new MatrixDisplayDouble();
md.init();

new UI(md).init();

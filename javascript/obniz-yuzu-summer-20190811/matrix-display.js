'use strict';
console.log('ver 20190811-01');

// https://obniz.io/ja/sdk/parts/MatrixLED_MAX7219/README.md
// JS canvas API: https://mzl.la/2YVip7I
class MatrixDisplay {
  constructor() {
    this.obniz = new Obniz("9207-0920");
    this.matrixOpt = { clk:0, cs:1, din:2, gnd:3, vcc:4 };
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
      d.print("#run");

      this._initMatrix();

      $(()=> {
        var text = $('#text').val();
        this.fillText(text);
      });
    };
  }

  fillText(text = 'hello', leftPos = 0) {
    var m = this.matrix;
    var c = this.canvas;

    c.fillStyle = "black";
    c.fillRect(0, 0, m.width, m.height);

    c.fillStyle = "white";
    c.fillText(text, leftPos, 7);
    m.draw(c);
  }

  fillTextAsTicker(text = 'hello', intv = 100) { // interval milli seconds
    var tw = Math.round(this.canvas.measureText(text).width);
    var pos = this.matrix.width;

    this.tickerId = setInterval(async ()=> {
      if(pos < tw * -1)
        pos = this.matrix.width; // 左端に消えたら開始位置に戻す

      this.fillText(text, pos);
      pos--;
    }, intv);
  }

  clearTicker() {
    if(!this.tickerId) return;
    clearInterval(this.tickerId);
  }

  // private methods
  _initMatrix() {
    var m = this.obniz.wired("MatrixLED_MAX7219", this.matrixOpt);
    m.init(8 * 4, 8);
    m.brightness(1); // 0 - 15
    m.clear();
    this.matrix = m;

    var c = this.obniz.util.createCanvasContext(m.width, m.height);
    c.font = this.font;
    this.canvas = c;
  }
}

class UI {
  constructor(md) {
    this.matrixDisplay = md;
  }

  init() {
    $(()=> {
      $('#applyTextBtn').click(()=> {
        var md = this.matrixDisplay;
        md.clearTicker();

        var text = $('#text').val();
        var asTicker = $('#ticker').prop('checked');
        if(asTicker)
          md.fillTextAsTicker(text);
        else
          md.fillText(text);
      });
    });
  }
}

// main scope
var md = new MatrixDisplay();
md.init();

new UI(md).init();

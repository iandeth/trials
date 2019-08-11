// https://obniz.io/ja/sdk/parts/MatrixLED_MAX7219/README.md
class MatrixDisplay {
  constructor() {
    this.obniz = new Obniz("9207-0920");
    this.matrixOpt = { clk:0, cs:1, din:2, gnd:3, vcc:4 };
    this.font = "9px sans-serif";

    this.matrix = undefined;
    this.canvas = undefined;
    this.tickerId = undefined; // setInterval id
  }

  run() {
    this.obniz.onconnect = async ()=> {
      var d = this.obniz.display;
      d.clear();
      d.print("MatrixDisplay");
      d.print("#run");

      this._initMatrix();

      $(()=> {
        var text = $('#text').val();
        //this.fillText(text);
        this.fillTextAsTicker(text);
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
    var pos = 0;
    this.tickerId = setInterval(async ()=> {
      this.fillText(text, pos);
      pos--;
    }, intv);
  }

  // private methods
  _run() {
    /*
    var dispMtxText = (txt='hello world') => {

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, matrix.width, matrix.height);
      ctx.fillStyle = "white";
      ctx.font = "9px sans-serif";
      //ctx.textBaseline = "top";

      var leftPos = 0;
      this.obniz.repeat(async ()=> {
        //this.obniz.display.clear();
        //this.obniz.display.print(`repeat: ${leftPos}`);

        ctx.clearRect(0, 0, matrix.width, matrix.height);
        ctx.fillText(txt, leftPos, 7);
        matrix.draw(ctx);

        await this.obniz.wait(5);
        leftPos--;
      });
    };
    */
  }

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
        var text = $('#text').val();
        this.matrixDisplay.fillText(text);
      });
    });
  }
}

// main scope
var md = new MatrixDisplay();
md.run();

new UI(md).init();

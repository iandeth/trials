'use strict';
var obniz = new Obniz('9207-0920');
var m, c;
obniz.onconnect = async ()=> {
  var opt = { clk:0, cs:1, din:2, gnd:3, vcc:4 };
  m = obniz.wired('MatrixLED_MAX7219', opt);
  m.init(8 * 4, 8);
  m.brightness(10); // 0 - 15
  m.clear();

  c = this.obniz.util.createCanvasContext(m.width, m.height);
  c.font = '9px sans-serif';

  c.fillStyle = 'black';
  c.fillRect(0, 0, m.width, m.height);

  c.fillStyle = 'white';
  c.fillText('hello', 0, 7);
  m.draw(c);
};

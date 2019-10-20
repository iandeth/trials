class Card {
  constructor(id, pd={}) {
    Object.keys(pd).forEach((k)=> {
      this[k] = pd[k]; // 引数 pd の中身を property に変換
    });
    this.id = id;
    this.baseUrl = 'https://www.jfa.jp/';
  }

  getRedirectUrl() {
    var ga = [
      'utm_source=qr_code',
      'utm_medium=handout_card',
      'utm_campaign=handout_card_20191021',
      `utm_content=id%3A${this.id}`
    ].join('&');
    //return `${this.baseUrl}${this.path}?${ga}`;
    return `${this.baseUrl}${this.path}?id=${this.id}`;
  }
}

module.exports = Card;

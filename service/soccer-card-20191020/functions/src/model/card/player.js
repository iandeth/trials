const Card = require('model/card');

class PlayerCard extends Card {
  constructor(id, pd={}) {
    super(id, pd);
    this.baseUrl = 'https://www.jfa.jp/samuraiblue/member/';
  }
}

module.exports = PlayerCard;

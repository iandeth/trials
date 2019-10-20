const PlayerCard = require('model/card/player');

class CardFinder {
  constructor() {
    this.cards = require('data/cards');
  }

  findById(id) {
    var pd = this.cards[id || ''];
    if(!pd) return undefined;
    if(pd.type == 'player')
      return new PlayerCard(id, pd);
    return undefined;
  }
}

module.exports = CardFinder;

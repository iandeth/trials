const CardFinder = require('model/card/finder');

class Card {
  runRedirect(req, res) {
    var id = req.query.id;
    var c = new CardFinder().findById(id);
    if(!c) {
      res.send(`card not found: id=${id}`);
      return;
    }
    var url = c.getRedirectUrl();
    console.log('card found', JSON.stringify(c), url);
    res.redirect(url);
  }
}

module.exports = Card;

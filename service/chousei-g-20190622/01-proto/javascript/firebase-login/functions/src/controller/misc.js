'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('../utils');

class MiscC {
  async helloWorld(req, res) {
    let user = await utils.CurrentUser.get(req);
    let data = req.body.data || {};
    let d = {
      t: "Hello from Firebase!",
      q: req.query,
      p: req.params,
      b: req.body,
      a: data.a,
      u: ((user)? user.toJSON() : undefined),
      conf: functions.config().firebase
    };
    return res.send({ data:d });
  }

  async addMessage(req, res) {
    let original = req.query.text;
    let snapshot = await admin.database().ref('/messages').push({ original: original });
    return res.redirect(303, snapshot.ref.toString());
  }
}

module.exports = MiscC;

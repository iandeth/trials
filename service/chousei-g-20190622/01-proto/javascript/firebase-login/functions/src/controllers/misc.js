'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('../utils');

class Misc {
  static async helloWorld(req, res) {
    var user = await utils.CurrentUser.get(req);
    var data = req.body.data || {};
    var d = {
      t: "Hello from Firebase!",
      q: req.query,
      p: req.params,
      b: req.body,
      a: data.a,
      u: ((user)? user.toJSON() : undefined),
      conf: functions.config().firebase
    };
    res.send({ data:d });
  }

  static async addMessage(req, res) {
    const original = req.query.text;
    const snapshot = await admin.database().ref('/messages').push({ original: original });
    res.redirect(303, snapshot.ref.toString());
  }
}

module.exports = Misc;

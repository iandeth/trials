'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('../utils');

class User {
  static async getOfflineAccess(req, res) {
    var user = await utils.CurrentUser.get(req);
    if(!user) return res.send('no user found');

    var code = (req.body.data || {}).code;
    if(!code) return res.send('no google auth token found');

    var token = await utils.GAPI.getToken(code);
    var d = { token:token, user:user };
    res.send({ data:d });
  }
}

module.exports = User;

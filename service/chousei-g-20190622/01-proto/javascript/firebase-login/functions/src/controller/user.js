'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('../utils');
const UserSecretM = require('../model/user_secret.js');

class UserC {
  async getOfflineAccess(req, res) {
    let user = await utils.CurrentUser.get(req);
    if(!user) return res.send('no user found');

    let code = (req.body.data || {}).code;
    if(!code) return res.send('no google auth token found');

    // get access|refresh tokens from Google API
    let token = await utils.GAPI.getToken(code);

    // save to user_secrets database
    let um = new UserSecretM(user);
    await um.set(token);

    if(token.refresh_token) token.refresh_token = '[not shown]';  // for security
    let d = { token:token, user:user };
    return res.send({ data:d });
  }
}

module.exports = UserC;

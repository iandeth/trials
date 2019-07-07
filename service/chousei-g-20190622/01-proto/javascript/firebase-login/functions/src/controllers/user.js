'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const utils = require('../utils');

class User {
  async getOfflineAccess(req, res) {
    let user = await utils.CurrentUser.get(req);
    if(!user) return res.send('no user found');

    let code = (req.body.data || {}).code;
    if(!code) return res.send('no google auth token found');

    let token = await utils.GAPI.getToken(code);
    await this._createUserSecret(user, token);

    if(token.refresh_token) token.refresh_token = 'ok';  // for security
    let d = { token:token, user:user };
    return res.send({ data:d });
  }

  // private methods
  _createUserSecret(user, token) {
    if(!user || !user.uid)
      return Promise.reject(new Error('uid not found'));
    if(!token || !token.refresh_token)
      return Promise.reject(new Error('token not found'));

    let db = admin.firestore();
    let doc = db.collection('user_secrets').doc(user.uid);
    return doc.set(token);
  }
}

module.exports = User;

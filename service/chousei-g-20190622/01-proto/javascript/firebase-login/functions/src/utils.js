'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const UserSecretM = require('./model/user_secret.js');

class GAPI {
  static getAuth(user=undefined) {
    let auth = new google.auth.OAuth2(
      functions.config().gapi.id,
      functions.config().gapi.secret,
      'postmessage'
    );
    // save to user_secrets database whenever new access|refresh tokens are fetched
    auth.on('tokens', (token) => {
      if(!user) return;
      new UserSecretM(user).set(token);
      console.log(
        'GAPI tokens update',
        user.uid,
        ((token.access_token)? true : false),
        ((token.refresh_token)? true : false)
      );
    });
    return auth;
  }

  // get refresh token for offline access
  static getToken(code, user) {
    return new Promise((resolve, reject) => {
      this.getAuth(user).getToken(code, (err, token) => {
        if(err) reject(err);
        else resolve(token);
      })
    })
  }
}

class CurrentUser {
  static async verify(req) {
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer '))
      throw new Error('no bearer header');
    let token = req.headers.authorization.split('Bearer ')[1];
    return await admin.auth().verifyIdToken(token);
  }

  static async get(req) {
    let idt = await this.verify(req);
    if(!idt) throw new Error('invalid token');
    return await admin.auth().getUser(idt.uid);
  }
}

module.exports = {
  GAPI: GAPI,
  CurrentUser: CurrentUser
};

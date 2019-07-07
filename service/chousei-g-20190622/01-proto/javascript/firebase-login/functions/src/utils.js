'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');

class GAPI {
  static getAuth() {
    return new google.auth.OAuth2(
      functions.config().gapi.id,
      functions.config().gapi.secret,
      'postmessage'
    );
  }

  // get refresh token for offline access
  static getToken(code) {
    return new Promise((resolve, reject) => {
      this.getAuth().getToken(code, (err, token) => {
        if(err) return reject(err);
        resolve(token);
      })
    })
  }
}

class CurrentUser {
  static async verify(req) {
    //console.log('#verifyIdToken auth header:', req.headers.authorization);
    if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      console.error('#verifyIdToken no bearer header');
      return;
    }
    var token = req.headers.authorization.split('Bearer ')[1];
    var idt = await admin.auth().verifyIdToken(token);
    if(!idt) {
      console.error('#verifyIdToken invalid token');
      return;
    }
    return idt;
  }

  static async get(req) {
    var idt = await this.verify(req);
    if(!idt) return;
    return await admin.auth().getUser(idt.uid);
  }
}

module.exports = {
  GAPI: GAPI,
  CurrentUser: CurrentUser
};

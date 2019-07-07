'use strict';
const admin = require('firebase-admin');

class UserSecretM {
  constructor(user) {
    if(!user || !user.uid) throw new Error('user is empty');
    this.user = user;
    this.db = admin.firestore();
  }

  async get() {
    let doc = await this._doc().get();
    return doc.data();
  }

  set(data={}) {
    if(!data || !data.refresh_token)
      return Promise.reject(new Error('token not found'));
    return this._doc().set(data);
  }

  // private methods
  _doc() {
    return this.db.collection('user_secrets').doc(this.user.uid);
  }
}

module.exports = UserSecretM;

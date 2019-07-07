'use strict';
const utils = require('../utils');
const { google } = require('googleapis');
const UserSecretM = require('../model/user_secret.js');

class UserCalendarM {
  constructor(user) {
    if(!user || !user.uid) throw new Error('user is empty');
    this.user = user;
  }

  async getEvents() {
    let auth = await this._getGapiAuthForUser(this.user);
    let cal = google.calendar({ version:'v3', auth:auth });
    let timeMin = this._getDaysAgoTimestamp(4);
    let events = await cal.events.list({
      calendarId: 'primary',
      timeZone: 'Asia/Tokyo',
      orderBy: 'startTime',
      singleEvents: true,
      timeMin: timeMin
    });
    return events.data.items;
  }

  // private methods
  async _getGapiAuthForUser(user) {
    let sm = new UserSecretM(user);
    let s = await sm.get();

    let auth = utils.GAPI.getAuth();
    auth.setCredentials({
      access_token: s.access_token, refresh_token: s.refresh_token
    });
    return auth;
  }

  _getDaysAgoTimestamp(days) {
    let date = new Date();
    let ago = new Date(date.getTime() - (days * 24 * 60 * 60 * 1000));
    return ago.toISOString();
  }
}

module.exports = UserCalendarM;

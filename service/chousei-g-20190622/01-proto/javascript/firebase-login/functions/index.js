'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin:true });

const MiscC = require('./src/controller/misc');
const UserC = require('./src/controller/user');
const CalendarC = require('./src/controller/calendar');

//console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

// routing
exports.misc_helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => { await new MiscC().helloWorld(req, res) });
});

exports.misc_addMessage = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => { await new MiscC().addMessage(req, res) });
});

exports.user_getOfflineAccess = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => { await new UserC().getOfflineAccess(req, res) });
});

exports.calendar_getEventsForUser = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => { await new CalendarC().getEventsForUser(req, res) });
});

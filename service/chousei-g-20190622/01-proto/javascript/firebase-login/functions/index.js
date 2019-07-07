'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin:true });

const ctrl = {};
ctrl.misc = require('./src/controllers/misc');
ctrl.user = require('./src/controllers/user');

//console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

// routing
exports.misc_helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => { await ctrl.misc.helloWorld(req, res) });
});

exports.misc_addMessage = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => { await ctrl.misc.addMessage(req, res) });
});

exports.user_getOfflineAccess = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => { await ctrl.user.getOfflineAccess(req, res) });
});

/*
exports.getEventList = functions.https.onRequest(async (req, res) => {
  var auth = utils.GAPI.getAuth();
  auth.setCredentials({
    //access_token: at
    refresh_token: rt
  });
  const cal = google.calendar({ version:'v3', auth:auth });
  const events = await cal.events.list({ calendarId:'primary' });
  return cors(req, res, () => {
    res.send({ data:events.data });
  });
});
*/

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors')({ origin:true });

admin.initializeApp();

exports.helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    res.send({ data:"Hello from Firebase!" });
  });
});

exports.conf = functions.https.onRequest((request, response) => {
  var c = require("../config/application_default_credentials.json");
  response.send(JSON.stringify(c));
});

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;
  const snapshot = await admin.database().ref('/messages').push({original: original});
  res.redirect(303, snapshot.ref.toString());
});

exports.gapiToken = functions.https.onRequest(async (request, response) => {
  const auth = new google.auth.OAuth2(
    '1004896667795-calqikba0n9klb1767n1bjsu4monb4n4.apps.googleusercontent.com',
    'ccfzQk5keLPA8VxyllA0nx6M',
    'postmessage'
  );
  const rt = '';
  const at = '';

  auth.setCredentials({
    //access_token: at
    refresh_token: rt
  });
  const cal = google.calendar({ version:'v3', auth:auth });
  const events = await cal.events.list({ calendarId:'primary' });
  response.send(events.data);
});

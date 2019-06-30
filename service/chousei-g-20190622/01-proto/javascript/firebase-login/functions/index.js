const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors')({ origin:true });

admin.initializeApp();

function getGAuth() {
  return new google.auth.OAuth2(
    '1004896667795-calqikba0n9klb1767n1bjsu4monb4n4.apps.googleusercontent.com',
    'postmessage'
  );
};

exports.helloWorld = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    var data = req.body.data || {};
    var d = {
      t: "Hello from Firebase!",
      q: req.query,
      p: req.params,
      b: req.body,
      a: data.a
    };
    res.send({ data:d });
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

exports.getOfflineAccess = functions.https.onRequest(async (req, res) => {
  const getToken = (code) => {
    return new Promise((resolve, reject) => {
      var auth = getGAuth();
      auth.getToken(code, (err, token) => {
        if(err) return reject(err);
        resolve(token);
      })
    })
  };
  return cors(req, res, () => {
    var code = (req.body.data || {}).code;
    getToken(code).then((token) => {
      var d = { token:token };
      res.send({ data:d });
    });
  });
});

exports.getEventList = functions.https.onRequest(async (req, res) => {
  // bashi
  var auth = getGAuth();
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

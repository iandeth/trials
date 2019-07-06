const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { google } = require('googleapis');
const cors = require('cors')({ origin:true });

//console.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

function getGAuth() {
  return new google.auth.OAuth2(
    functions.config().gapi.id,
    functions.config().gapi.secret,
    'postmessage'
  );
}

async function verifyCurrentUser(req) {
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

async function getCurrentUser(req) {
  var idt = await verifyCurrentUser(req);
  if(!idt) return;
  return await admin.auth().getUser(idt.uid);
}

exports.helloWorld = functions.https.onRequest(async (req, res) => {
  var user = await getCurrentUser(req);
  return cors(req, res, () => {
    var data = req.body.data || {};
    var d = {
      t: "Hello from Firebase!",
      q: req.query,
      p: req.params,
      b: req.body,
      a: data.a,
      u: ((user)? user.toJSON() : undefined)
    };
    res.send({ data:d });
  });
});

exports.addMessage = functions.https.onRequest(async (req, res) => {
  const original = req.query.text;
  const snapshot = await admin.database().ref('/messages').push({ original: original });
  res.redirect(303, snapshot.ref.toString());
});

exports.getOfflineAccess = functions.https.onRequest(async (req, res) => {
  const getToken = async (code) => {
    return new Promise((resolve, reject) => {
      var auth = getGAuth();
      auth.getToken(code, (err, token) => {
        if(err) return reject(err);
        resolve(token);
      })
    })
  };
  return cors(req, res, async () => {
    var user = await getCurrentUser(req);
    if(!user) return res.send('no user found');

    var code = (req.body.data || {}).code;
    if(!code) return res.send('no google auth token found');

    var token = await getToken(code);
    var d = { token:token, user:user };
    res.send({ data:d });
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

'use strict';
require('module-alias/register'); //= https://www.npmjs.com/package/module-alias

const functions = require('firebase-functions');
const Card = require('controller/card');

exports.card = functions.https.onRequest((req, res)=> {
  new Card().runRedirect(req, res);
});

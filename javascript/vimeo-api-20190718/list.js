'use strict';
let cre = require('./credentials.json');
let Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(cre.id, cre.secret, cre.accessToken);

// hello http://bit.ly/2Yb7syr
client.request({
  method: 'GET',
  path: '/tutorial'
}, function (error, body, code, headers) {
  if(error) console.log(error);
  console.log(body);
});

// upload http://bit.ly/2Y8MkJa
let file = "/Users/iandeth/Desktop/foo.mov";
client.upload(file, {
  'name': 'cse test bashi',
  'description': new Date().toString()
}, function (uri) {
  console.log('Your video URI is: ' + uri);
}, function (bytes_uploaded, bytes_total) {
  var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2);
  console.log(bytes_uploaded, bytes_total, percentage + '%');
}, function (error) {
  console.log('Failed because: ' + error);
});

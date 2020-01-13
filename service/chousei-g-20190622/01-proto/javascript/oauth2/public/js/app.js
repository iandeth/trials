var apiKey = 'AIzaSyC-cXF7g27RUN5Q10xcHib72-xoyaX3dDQ';
var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];
var clientId = '1004896667795-calqikba0n9klb1767n1bjsu4monb4n4.apps.googleusercontent.com';
var scopes = [
  'profile',
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events'
].join(' ');

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var revokeButton = document.getElementById('revoke-button');
var offlineButton = document.getElementById('offline-button');

function handleClientLoad() {
  // Load the API client and auth2 library
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: apiKey,
    discoveryDocs: discoveryDocs,
    clientId: clientId,
    scope: scopes
  }).then(function () {
    var auth = gapi.auth2.getAuthInstance();
    auth.isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(auth.isSignedIn.get());

    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    revokeButton.onclick = handleRevokeClick;
    offlineButton.onclick = handleOfflineClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    revokeButton.style.display = 'block';
    offlineButton.style.display = 'block';
    makeApiCall();
    console.log('user', gapi.auth2.getAuthInstance().currentUser.get());
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    revokeButton.style.display = 'none';
    offlineButton.style.display = 'none';
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function handleRevokeClick(event) {
  gapi.auth2.getAuthInstance().disconnect();
}

function handleOfflineClick(event) {
  gapi.auth2.getAuthInstance().grantOfflineAccess().then((res) => {
    console.log('offline', res, this);
  });
}

function makeApiCall() {
  gapi.client.people.people.get({
    'resourceName': 'people/me',
    'requestMask.includeField': 'person.names'
  }).then(function(resp) {
    var p = document.createElement('p');
    var name = resp.result.names[0].givenName;
    p.appendChild(document.createTextNode('Hello, '+name+'!'));
    document.getElementById('content').appendChild(p);
  });
}

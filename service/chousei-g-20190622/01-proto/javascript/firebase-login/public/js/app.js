class App {
  constructor() {
    this.$inBtn = $('#signin');
    this.$outBtn = $('#signout');
    this.$helloBtn = $('#hello');
    this.googleAccessToken = undefined;
    this.googleIdToken = undefined;
  }

  initUI() {
    this.$inBtn.on('click', ()=> {
      console.log('signin start');
      new Auth().signin().then((res)=> {
        this.googleAccessToken = res.credential.accessToken;
        this.googleIdToken = res.credential.idToken;
      });
      return false;
    }).hide();

    this.$outBtn.on('click', ()=> {
      firebase.auth().signOut();
      return false;
    }).hide();

    this.$helloBtn.on('click', ()=> {
      var hello = firebase.functions().httpsCallable('helloWorld');
      hello().then((r)=> { console.log('hello', r) });
      return false;
    });
  }

  run() {
    console.log('app run');
    if(location.hostname.match('localhost|ngrok.io'))
      firebase.functions().useFunctionsEmulator('http://localhost:5001');

    new GAPI().init();
    this.initUI();
    this.initSignInCheck();
  }

  initSignInCheck() {
    firebase.auth().onAuthStateChanged((user)=> {
      if(user) {
        console.log('signed in', user);
        this.$outBtn.show();
        this.$inBtn.hide();
      } else {
        console.log('signed out')
        this.$outBtn.hide();
        this.$inBtn.show();
      }
    });
  }
}

class Auth {
  signin() {
    firebase.auth().useDeviceLanguage();
    var p = new firebase.auth.GoogleAuthProvider();
    p.addScope([
      'https://www.googleapis.com/auth/calendar.readonly',
      'https://www.googleapis.com/auth/calendar.events'
    ].join(' '));
    return firebase.auth().signInWithPopup(p).then((res)=> {
      window.user = res;
      if(res.additionalUserInfo.isNewUser)
        console.log('signup complete', res);
      else
        console.log('signin complete', res);
      return Promise.resolve(res);
    }).catch(function(error) {
      console.log('error', error);
      return Promise.reject(error);
    });
  }
}

class GAPI {
  init() {
    gapi.load('client:auth2', () => {
      var apiKey = 'AIzaSyC-cXF7g27RUN5Q10xcHib72-xoyaX3dDQ';
      var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];
      var clientId = '1004896667795-calqikba0n9klb1767n1bjsu4monb4n4.apps.googleusercontent.com';
      var scopes = [
        'profile',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
      ].join(' ');
      gapi.client.init({
        apiKey: apiKey,
        discoveryDocs: discoveryDocs,
        clientId: clientId,
        scope: scopes
      });
    });
  }

  getCalEvents() {
    gapi.client.setToken({ access_token: user.credential.accessToken });
  }
}

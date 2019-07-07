class App {
  constructor() {
    this.$username = $('#username');
    this.$inBtn = $('#signin');
    this.$outBtn = $('#signout');
    this.$offlineBtn = $('#offline');
    this.$helloBtn = $('#hello');
    this.auth = undefined;
    this.gapi = undefined;
  }

  initUI() {
    this.$inBtn.on('click', ()=> {
      console.log('signin start');
      this.auth.signIn();
      return false;
    }).hide();

    this.$outBtn.on('click', ()=> {
      this.auth.signOut();
      return false;
    }).hide();

    this.$offlineBtn.on('click', ()=> {
      this.gapi.grantOfflineAccess().then((code) => {
        var goa = firebase.functions().httpsCallable('getOfflineAccess');
        goa({ code:code }).then((r)=> { console.log('offline cf', r) });
      });
      return false;
    }).hide();

    this.$helloBtn.on('click', ()=> {
      var hello = firebase.functions().httpsCallable('helloWorld');
      hello({ a:1, b:2 }).then((r)=> { console.log('hello', r) });
      return false;
    });
  }

  run() {
    console.log('app run');
    if(location.hostname.match('localhost|ngrok.io'))
      firebase.functions().useFunctionsEmulator('http://localhost:5001');

    this.auth = new Auth();
    this.gapi = new GAPI();
    this.gapi.init();

    this.initUI();
    this.initSignInCheck();
  }

  initSignInCheck() {
    firebase.auth().onAuthStateChanged((user)=> {
      if(user) {
        console.log('signed in', user);
        this.$username.text('Hi, ' + user.displayName).show();
        this.$inBtn.hide();
        this.$outBtn.show();
        this.$offlineBtn.show();
      } else {
        console.log('signed out')
        this.$username.text('').hide();
        this.$inBtn.show();
        this.$outBtn.hide();
        this.$offlineBtn.hide();
      }
    });
  }
}

class Auth {
  signIn() {
    firebase.auth().useDeviceLanguage();
    var p = new firebase.auth.GoogleAuthProvider();
    return firebase.auth().signInWithPopup(p).then((res)=> {
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

  signOut() {
    firebase.auth().signOut();
  }
}

class GAPI {
  init() {
    gapi.load('client:auth2', ()=> {
      var clientId = '1004896667795-calqikba0n9klb1767n1bjsu4monb4n4.apps.googleusercontent.com';
      var scopes = [
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
      ].join(' ');
      gapi.client.init({
        clientId: clientId,
        scope: scopes
      });
    });
  }

  grantOfflineAccess() {
    return gapi.auth2.getAuthInstance().grantOfflineAccess().then((res)=> {
      console.log('offline', res);
      return Promise.resolve(res.code);
    });
  }
}

class App {
  constructor() {
    this.$signOutUserPanel = undefined;
    this.$signInUserPanel = undefined;
    this.auth = undefined;
    this.gapi = undefined;
  }

  run() {
    console.log('app run');
    if(location.hostname.match('localhost|ngrok.io'))
      firebase.functions().useFunctionsEmulator('http://localhost:5001');

    this.auth = new Auth();
    this.gapi = new GAPI();
    this.gapi.init();

    $(()=> {
      this.initUI();
      this.initSignInCheck();
    });
  }

  initUI() {
    this.$signOutUserPanel = $('#sign-out-user-panel');
    this.$signInUserPanel = $('#sign-in-user-panel');
    var $inBtn = $('#signin');
    var $outBtn = $('#signout');
    var $offlineBtn = $('#offline');
    var $helloBtn = $('#hello');

    $inBtn.on('click', ()=> {
      console.log('signin start');
      this.auth.signIn();
      return false;
    });

    $outBtn.on('click', ()=> {
      this.auth.signOut();
      return false;
    });

    $offlineBtn.on('click', ()=> {
      this.gapi.grantOfflineAccess().then((code)=> {
        var goa = firebase.functions().httpsCallable('user_getOfflineAccess');
        goa({ code:code }).then((r)=> { console.log('offline cf', r) });
      });
      return false;
    });

    $helloBtn.on('click', ()=> {
      $helloBtn.hide();
      var hello = firebase.functions().httpsCallable('misc_helloWorld');
      hello({ a:1, b:2 }).then((r)=> {
        console.log('hello', r);
        $helloBtn.show();
      });
      return false;
    });
  }

  initSignInCheck() {
    firebase.auth().onAuthStateChanged((user)=> {
      let $username = $('#username');
      if(user) {
        console.log('signed in', user);
        $username.text('Hi, ' + user.displayName);
        this.$signInUserPanel.show();
        this.$signOutUserPanel.hide();
      } else {
        console.log('signed out')
        $username.text('');
        this.$signInUserPanel.hide();
        this.$signOutUserPanel.show();
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
    return firebase.auth().signOut();
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

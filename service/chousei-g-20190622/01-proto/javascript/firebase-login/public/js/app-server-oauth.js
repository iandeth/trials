class App {
  constructor() {
    this.$inBtn = $('#signin');
    this.$outBtn = $('#signout');
    this.$helloBtn = $('#hello');
    this.gapi = undefined;
  }

  initUI() {
    this.$inBtn.on('click', ()=> {
      console.log('signin start');
      this.gapi.grantOfflineAccess();
      return false;
    }).hide();

    this.$outBtn.on('click', ()=> {
      firebase.auth().signOut();
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

    (this.gapi = new GAPI()).init();
    this.initUI();
    this.initSignInCheck();
  }

  initSignInCheck() {
    firebase.auth().onAuthStateChanged((user)=> {
      if(user) {
        console.log('signed in', user);
        this.$inBtn.hide();
        this.$outBtn.show();
      } else {
        console.log('signed out')
        this.$inBtn.show();
        this.$outBtn.hide();
      }
    });
  }
}

class GAPI {
  init() {
    gapi.load('client:auth2', () => {
      var clientId = '1004896667795-calqikba0n9klb1767n1bjsu4monb4n4.apps.googleusercontent.com';
      var scopes = [
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events'
      ].join(' ');
      gapi.client.init({
        client_id: clientId,
        scope: scopes
      });
    });
  }

  grantOfflineAccess() {
    return gapi.auth2.getAuthInstance().grantOfflineAccess().then((code)=> {
      return new Promise((resolve)=> {
        var goa = firebase.functions().httpsCallable('getOfflineAccess');
        return goa({ code:code }).then((r)=> {
          console.log('offline cf', r);
          var c = firebase.auth.GoogleAuthProvider.credential(r.data.token.id_token);
          firebase.auth().signInWithCredential(c).then((r2)=> {
            console.log('signInWithCredential %o', r2);
            return Promise.resolve();
          }).catch((error)=> {
            console.error('signInWithCredential %o', error);
            return Promise.reject();
          });
        });
      });
    });
  }
}

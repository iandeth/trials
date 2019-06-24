class App {
  constructor() {
    this.$inBtn = $('#signin');
    this.$outBtn = $('#signout');
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
  }

  run() {
    console.log('app run');
    this.initUI();
    this.initSignInCheck();
  }

  initSignInCheck() {
    firebase.auth().onAuthStateChanged((user)=> {
      if(user) {
        console.log('signed in', user);
        this.$outBtn.show();
        this.$inBtn.hide();
        window.user = user;
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

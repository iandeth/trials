import Cookies from 'js-cookie';
import FirebaseUtil from 'js/common/firebase-util';
import Router from 'js/common/router';
import NotFoundController from 'js/controller/not-found';
import ServiceUnavailableController from 'js/controller/service-unavailable';

window.Cookies = Cookies;

export default class MainScopeLogics {
  static waitFirebaseSDK() {
    // firebase SDK の初期化完了を待つ
    return FirebaseUtil.waitForSDK();
  }

  static resolveController(path) {
    var s = new Router().getControllerActionForPath(path);
    if(!s.c)
      return Promise.reject('404 controller not routed');
    if(!s.c[s.a])
      return Promise.reject(`404 action ${(s.a)? '#'+s.a+' ' : ''}not defined for ${s.c.constructor.name}`);
    console.log('routed', s);
    return s;
  }

  static checkLogin(s) {
    if(!s.requireLogin)
      return Promise.resolve(s);

    var uid = Cookies.get('uid');
    if(uid) {
      s.c.current_user = { id:uid, name:'bashi' };
      return Promise.resolve(s);
    }

    return Promise.reject('require login');
  }

  static runControllerAction(s) {
    return s.c[s.a]();
  }

  static finalizeChain() {
    console.log('end');
  }

  static handleError(e) {
    var c;
    if(e instanceof Error) {
      c = new ServiceUnavailableController();
    } else if(e.match(/^404/)) {
      c = new NotFoundController();
    } else if(e.match(/^require login/)) {
      console.log('redirect to login page');
      window.location = '/login/';
      return;
    } else {
      c = new ServiceUnavailableController();
    }
    console.error('rejected:', e);
    return c.index();
  }
}

'use strict';
import 'common/style.css';
import FirebaseUtil from 'js/common/firebase-util';
import Router from 'js/common/router';
import ServiceUnavailableController from 'js/controller/service-unavailable.js';

// ここから main scope
console.log('begin');
Promise.resolve() // begin promise chain
  .then(()=> {
    // firebase SDK の初期化完了を待つ
    return FirebaseUtil.waitForSDK();
  })
  .then(()=> {
    // url path から実行 controller を判定 → 実行
    var path = window.location.pathname;
    var c = new Router().getControllerForPath(path);
    if(!c) return Promise.reject('controller not routed');
    console.log('routed controller', c);
    return c.run();
  })
  .then(()=> console.log('end'))
  .catch(function(e) {
    if(e instanceof Error) console.error(e);
    else console.error('rejected:', e);
    new ServiceUnavailableController().run();
  });

  //var x = async ()=> {
  //  return await $.get('http://localhost:5000/');
  //};

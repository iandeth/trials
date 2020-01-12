'use strict';
import 'assets/common/style.css';
import M from 'js/common/main-scope-logics';

// main scope
console.log('begin');
var path = window.location.pathname;

Promise.resolve() // begin promise chain
  .then(M.waitFirebaseSDK)
  .then(()=> M.resolveController(path))
  .then(M.checkLogin)
  .then(M.runControllerAction)
  .then(M.finalizeChain)
  .catch(M.handleError);

  //var x = async ()=> {
  //  return await $.get('http://localhost:5000/');
  //};

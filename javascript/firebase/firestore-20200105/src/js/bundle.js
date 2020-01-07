'use strict';
import 'common/style.css';
import IndexController from 'js/controller/index';
import DetailController from 'js/controller/detail';

console.log('bundle.js', 'v20200105-2');
$(()=> {
  let app = firebase.app();
  let features = ['auth', 'functions', 'database', 'performance'].filter(feature => typeof app[feature] === 'function');
  console.log(`Firebase SDK loaded with ${features.join(', ')}`);

  var path = window.location.pathname;
  if(path == '/')
    new IndexController().run();
  else if(path.match('^/detail/\\d+/$'))
    new DetailController().run();

  //var x = async ()=> {
  //  return await $.get('http://localhost:5000/');
  //};
});

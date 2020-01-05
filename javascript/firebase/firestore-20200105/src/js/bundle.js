'use strict';
import 'common/style.css';
import IndexController from 'js/controller/index';

console.log('bundle.js', 'v20200105-2');
$(()=> {
  let app = firebase.app();
  let features = ['auth', 'functions', 'database'].filter(feature => typeof app[feature] === 'function');
  console.log(`Firebase SDK loaded with ${features.join(', ')}`);

  new IndexController().run();
});

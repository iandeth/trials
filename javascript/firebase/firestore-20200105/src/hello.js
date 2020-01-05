'use strict';
//import firebase from "firebase/app";
//import "firebase/auth";
//import "firebase/functions";
//import "firebase/database";
import HelloController from 'controller/hello';

console.log('hello.js', 'v20200105-2');
$(()=> {
  let app = firebase.app();
  let features = ['auth', 'functions', 'database'].filter(feature => typeof app[feature] === 'function');
  console.log(`Firebase SDK loaded with ${features.join(', ')}`);

  new HelloController().run();
});

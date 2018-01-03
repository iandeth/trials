'use strict';

var App = function(){};
App.prototype = {
  bark: function(word){
    return "bow! " + word;
  },
  _window_location: function(){
    return window.location;
  }
};

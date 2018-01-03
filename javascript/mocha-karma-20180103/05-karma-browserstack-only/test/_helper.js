// require 'vendor/jquery'
// require 'vendor/js.cookie'

var TestHelper = function(){};
TestHelper.prototype = {
  // it will only remove cookies with default path
  deleteAllCookies: function (){
    var cookies = document.cookie.split(/;\s*/);
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      Cookies.remove(name);
    }
    if (document.cookie != "")
      console.error("cookie not deleted", document.cookie);
  }
};

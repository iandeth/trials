import TopController from 'js/controller/top';
import DetailController from 'js/controller/detail';
import LoginController from 'js/controller/login';
import MyController from 'js/controller/my';

export default class Router {
  getControllerActionForPath(path) {
    var s = {
      c: undefined, //= controller instance
      a: undefined, //= action method name
      requireLogin: false
    };

    if(path == '/') {
      s.c = new TopController();
      s.a = 'index';
    } else if(path.match('^/detail/')) {
      s.c = new DetailController();
      if(path.match('^/detail/(\\d+)/$')) {
        s.c.prm = { id:RegExp.$1 };
        s.a = 'index';
      }
    } else if(path.match('^/login/$')) {
      s.c = new LoginController();
      s.a = 'index';
    } else if(path.match('^/my/$')) {
      s.requireLogin = true;
      s.c = new MyController();
      s.a = 'index';
    }
    return s;
  }
}

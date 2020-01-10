import IndexController from 'js/controller/index';
import DetailController from 'js/controller/detail';
import LoginController from 'js/controller/login';
import MyController from 'js/controller/my';

export default class Router {
  getControllerForPath(path) {
    var s = { c:undefined, requireLogin: false };
    if(path == '/') {
      s.c = new IndexController();
    } else if(path.match('^/detail/(\\d+)/$')) {
      var prm = { id:RegExp.$1 };
      s.c = new DetailController({ prm:prm });
    } else if(path.match('^/login/$')) {
      s.c = new LoginController();
    } else if(path.match('^/my/$')) {
      s.requireLogin = true;
      s.c = new MyController();
    }
    return s;
  }
}

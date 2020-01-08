import IndexController from 'js/controller/index';
import DetailController from 'js/controller/detail';
import NotFoundController from 'js/controller/not-found';

export default class Router {
  getControllerForPath(path) {
    if(path == '/') {
      return new IndexController();
    } else if(path.match('^/detail/(\\d+)/$')) {
      var prm = { id:RegExp.$1 };
      return new DetailController({ prm:prm });
    } else {
      return new NotFoundController();
    }
  }
}

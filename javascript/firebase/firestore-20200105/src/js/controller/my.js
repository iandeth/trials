import BaseController from 'js/controller/base';
import IndexView from 'js/view/my/index';

export default class MyController extends BaseController {
  index() {
    return new IndexView().run(this);
  }
}

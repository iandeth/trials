import BaseController from 'js/controller/base';
import IndexView from 'js/view/login/index';

export default class LoginController extends BaseController {
  index() {
    return new IndexView().run(this);
  }
}

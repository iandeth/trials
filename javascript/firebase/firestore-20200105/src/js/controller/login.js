import BaseController from 'js/controller/base';
import View from 'js/view/login';

export default class LoginController extends BaseController {
  run() {
    return new View().run();
  }
}

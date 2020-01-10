import BaseController from 'js/controller/base';
import View from 'js/view/my';

export default class MyController extends BaseController {
  run() {
    var s = { current_user:this.current_user };
    return new View().run(s);
  }
}

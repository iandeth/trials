import BaseController from 'js/controller/base';
import View from 'js/view/index';
import Dog from 'js/model/dog';

export default class IndexController extends BaseController {
  run() {
    var s = { //= stash
      prm: this.prm,
      dog: new Dog()
    };
    return new View().run(s);
  }
}

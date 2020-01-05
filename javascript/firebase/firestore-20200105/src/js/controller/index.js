import Dog from 'js/model/dog';
import View from 'js/view/index';

export default class IndexController {
  run() {
    var m = { dog: new Dog() };
    return new View().run(m);
  }
}

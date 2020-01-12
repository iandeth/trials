import BaseController from 'js/controller/base';
import IndexView from 'js/view/top/index';
import Dog from 'js/model/dog';

export default class TopController extends BaseController {
  index() {
    this.dog = new Dog();
    return new IndexView().run(this);
  }
}

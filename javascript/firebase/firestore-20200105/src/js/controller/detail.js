import BaseController from 'js/controller/base';
import IndexView from 'js/view/detail/index';

export default class DetailController extends BaseController {
  index() {
    //throw new Error('id not found');
    return new IndexView().run(this);
  }
}

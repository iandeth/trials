import BaseController from 'js/controller/base';
import IndexView from 'js/view/not-found/index';

export default class NotFoundController extends BaseController {
  index() {
    return new IndexView().run(this);
  }
}

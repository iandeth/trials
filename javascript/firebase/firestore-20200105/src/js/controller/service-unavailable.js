import BaseController from 'js/controller/base';
import IndexView from 'js/view/service-unavailable/index';

export default class ServiceUnavailableController extends BaseController {
  index() {
    return new IndexView().run(this);
  }
}

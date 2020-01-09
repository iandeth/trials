import BaseController from 'js/controller/base';
import View from 'js/view/service-unavailable';

export default class ServiceUnavailableController extends BaseController {
  run() {
    return new View().run();
  }
}

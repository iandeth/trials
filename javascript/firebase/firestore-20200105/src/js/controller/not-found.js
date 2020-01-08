import BaseController from 'js/controller/base';
import View from 'js/view/not-found';

export default class NotFoundController extends BaseController {
  run() {
    return new View().run();
  }
}

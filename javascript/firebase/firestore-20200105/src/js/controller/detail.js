import BaseController from 'js/controller/base';
import View from 'js/view/detail';

export default class DetailController extends BaseController {
  run() {
    //throw new Error('id not found');
    var s = { prm:this.prm };
    return new View().run(s);
  }
}

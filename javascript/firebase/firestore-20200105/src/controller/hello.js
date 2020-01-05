import Dog from 'model/dog';
import View from 'view/hello';

const Promise = kzs.Promise;
const $ = kzs.$;

export default class {
  run() {
    var m = { dog: new Dog() };
    return new View().run(m);
  }
}

import Dog from 'model/dog';
import View from 'view/hello';

export default class {
  run() {
    var m = { dog: new Dog() };
    return new View().run(m);
  }
}

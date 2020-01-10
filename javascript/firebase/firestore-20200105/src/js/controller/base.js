export default class BaseController {
  constructor(h={}) {
    this.prm = h.prm || {};
    this.current_user = undefined;
  }
}

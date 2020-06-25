import Timeline from "src/timeline";
import Reactions from "src/reactions";

export default class Controller {
  run() {
    this._runTimeline();
    this._runReactions();
  }

  // private methods
  _runTimeline() {
    let auto = true;
    const p = window.location.search;
    if (p.match(/tl=0/)) auto = false;
    new Timeline().run(auto);
  }

  _runReactions() {
    let auto = true;
    const p = window.location.search;
    if (p.match(/re=0/)) auto = false;
    new Reactions().run(auto);
  }
}

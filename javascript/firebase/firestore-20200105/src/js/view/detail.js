import style from 'detail/style.css';
import iconImg from 'detail/icon.png';

export default class DetailView {
  run() {
    var p = this._params();

    style.use();
    this._render(p);
    console.log('detailView#render done');
  }

  // private methods
  _params() {
    var m = (window.location.pathname.match("^/detail/(\\d+)/") || []);
    return { id:m[1] };
  }

  _render(p) {
    $('body').append(`
      <div class="result">
        <strong>this is detail page #${p.id}</strong><br>
        <img src="${iconImg}" width="20">
        <div><a href="/">top</a></div>
      </div>
    `);
  }
}

import style from 'detail/style.css';
import iconImg from 'detail/icon.png';

export default class IndexView {
  run() {
    style.use();
    this._render();
  }

  // private methods
  _render() {
    $('body').append(`
      <div class="result">
        <strong>this is detail page</strong><br>
        <img src="${iconImg}" width="20">
      </div>
    `);
  }
}

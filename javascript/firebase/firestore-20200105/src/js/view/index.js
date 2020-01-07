import style from 'index/style.css';
import iconImg from 'index/icon.png';

export default class IndexView {
  run(m) {
    style.use();
    this._render(m);
  }

  // private methods
  _render(m) {
    $('body').append(`
      <div class="result">
        <strong>${m.dog.bark()}</strong><br>
        <img src="${iconImg}" width="20">
      </div>
    `);
  }
}
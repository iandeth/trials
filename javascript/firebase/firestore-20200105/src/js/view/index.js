import style from 'index/style.css';

export default class IndexView {
  run(m) {
    style.use();
    this._render(m);
  }

  // private methods
  _render(m) {
    $('body').append(`
      <div class="result">
        <strong>${ m.dog.bark() }</strong>
      </div>
    `);
  }
}

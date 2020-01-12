import BaseView from 'js/view/base';
import style from 'assets/detail/style.css';
import iconImg from 'assets/detail/icon.png';

export default class DetailIndexView extends BaseView {
  run(c) {
    style.use();
    this._setMeta(c);
    this._render(c);
    console.log('#run done');
  }

  // private methods
  _setMeta(c) {
    $('title').text(`Detail ID #${c.prm.id} | ${this.siteName}`);
  }

  _render(c) {
    $('#message').append(`
      <h2>Detail Page</h2>
      <h1>ID #${c.prm.id}</h1>
      <p>Tom Hanks' son Chet reacts to cultural appropriation controversy over his patois at the Golden Globes</p>
    `);

    $('body').append(`
      <div class="result">
        <img src="${iconImg}" width="20">
        <div><a href="/">top</a></div>
      </div>
    `);
  }
}

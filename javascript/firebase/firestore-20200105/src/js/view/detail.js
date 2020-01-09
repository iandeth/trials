import BaseView from 'js/view/base';
import style from 'detail/style.css';
import iconImg from 'detail/icon.png';

export default class DetailView extends BaseView {
  run(s={}) {
    style.use();
    this._setMeta(s);
    this._render(s);
    console.log('#run done');
  }

  // private methods
  _setMeta(s={}) {
    $('title').text(`Detail ID #${s.prm.id} | ${this.siteName}`);
  }

  _render(s={}) {
    $('#message').append(`
      <h2>Detail Page</h2>
      <h1>ID #${s.prm.id}</h1>
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

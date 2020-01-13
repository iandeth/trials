import BaseView from 'js/view/base';

export default class MyIndexView extends BaseView {
  run(c) {
    this._setMeta(c);
    this._render(c);
    console.log('#run done');
  }

  // private methods
  _setMeta() {
    $('title').text(`My Page | ${this.siteName}`);
  }

  _render(c) {
    $('#message').append(`
      <h2>id #${c.current_user.id}</h2>
      <h1>My Page</h1>
      <p>ログインユーザーの my page だよ</p>
    `);

    $('body').append(`
      <div class="result">
        <div><a href="/">top</a></div>
      </div>
    `);
  }
}

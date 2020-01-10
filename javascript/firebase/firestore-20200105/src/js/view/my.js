import BaseView from 'js/view/base';

export default class MyView extends BaseView {
  run(s) {
    this._setMeta();
    this._render(s);
    console.log('#run done');
  }

  // private methods
  _setMeta() {
    $('title').text(`My Page | ${this.siteName}`);
  }

  _render(s) {
    $('#message').append(`
      <h2>id #${s.current_user.id}</h2>
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

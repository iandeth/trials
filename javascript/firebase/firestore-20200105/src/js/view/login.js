import BaseView from 'js/view/base';

export default class LoginView extends BaseView {
  run() {
    this._setMeta();
    this._render();
    console.log('#run done');
  }

  // private methods
  _setMeta() {
    $('title').text(`Login | ${this.siteName}`);
  }

  _render() {
    $('#message').append(`
      <h2>Login</h2>
      <h1>Login</h1>
      <p>ログイン ID/PASS いれてね</p>
    `);
  }
}

import BaseView from 'js/view/base';
import style from 'assets/top/style.css';
import iconImg from 'assets/top/icon.png';

export default class TopIndexView extends BaseView {
  run(c) {
    style.use();
    this._setMeta(c);
    this._render(c);
    console.log('#run done');
  }

  // private methods
  _setMeta() {
    $('title').text(this.siteName);
  }

  _render(c) {
    $('#message').append(`
      <h2>Top Page</h2>
      <h1>Firebase Hosting Setup Complete</h1>
      <p>You're seeing this because you've successfully setup Firebase Hosting. Now it's time to go build something extraordinary!</p>
      <a target="_blank" href="https://firebase.google.com/docs/hosting/">Open Hosting Documentation</a>
    `);

    $('body').append(`
      <div class="result">
        <strong>${c.dog.bark()}</strong><br>
        <img src="${iconImg}" width="20">
        <div><a href="/detail/20/">detail #20</a></div>
        <div><a href="/my/">my page</a></div>
      </div>
    `);
  }
}

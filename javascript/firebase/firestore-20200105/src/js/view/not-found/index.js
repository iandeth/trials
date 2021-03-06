import BaseView from 'js/view/base';

export default class NotFoundIndexView extends BaseView {
  run(c) {
    this._setMeta(c);
    this._render(c);
    console.log('#run done');
  }

  // private methods
  _setMeta() {
    $('title').text(`Page Not Found | ${this.siteName}`);
  }

  _render() {
    $('#message').append(`
      <h2>404</h2>
      <h1>Page Not Found</h1>
      <p>The specified file was not found on this website. Please check the URL for mistakes and try again.</p>
      <h3>Why am I seeing this?</h3>
      <p>This page was generated by the Firebase Command-Line Interface. To modify it, edit the <code>404.html</code> file in your project's configured <code>public</code> directory.</p>
    `);
  }
}

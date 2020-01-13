import BaseView from 'js/view/base';

export default class ServiceUnavailableIndexView extends BaseView {
  run(c) {
    this._setMeta(c);
    this._render(c);
    console.log('#run done');
  }

  // private methods
  _setMeta() {
    $('title').text(`Service Unavailable | ${this.siteName}`);
  }

  _render() {
    $('#message').append(`
      <h2>503</h2>
      <h1>Service Unavailable</h1>
      <p>エラーなんです</p>
    `);
  }
}

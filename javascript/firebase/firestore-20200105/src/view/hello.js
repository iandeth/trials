import style from './hello.css';

export default class {
  run(m) {
    style.use(); // append style
    return new Promise((resolve)=> {
      $(()=> {
        this._render(m);
        resolve();
      });
    });
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

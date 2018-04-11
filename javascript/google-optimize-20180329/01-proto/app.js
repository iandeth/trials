
var App = function(h) { this.init.apply(this, arguments); };
App.prototype = {
  init: function(h) {},

  run: function() {
    this._setupDialog();
  },

  _setupDialog: function() {
    $(function() {
      var btnOpen = $('#d-open');
      var tgtDiv = $('#d-wrap');
      console.log(tgtDiv);

      var dialogSrc = `
        <div id="dialog">
          <div>message</div>
          <div><a id="d-close" href="">close</a></div>
        </div>
      `;

      btnOpen.click(function(){
        if($('#dialog').length > 0)
          return false;

        var dialog = $(dialogSrc);
        dialog.find('#d-close').click(function() {
          dialog.remove();
          return false;
        });

        tgtDiv.append(dialog);
        console.log('show dialog');
        return false;
      });
    });
  }
};

var app = new App({});
app.run();

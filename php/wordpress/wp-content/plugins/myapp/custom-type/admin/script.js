MyApp_Admin = function (){ this.initialize.apply(this, arguments) };
MyApp_Admin.prototype = {

    initialize: function(h) {
        // for method dup-call suppression
        this.disabled = false;
        // for form re-submit upon validate pass
        this.validate_ok = false;
        // whether the form was submitted by clicking publish button or not
        this.publish_button_clicked = false;
        // dom elements
        this.form = jQuery('form#post');
        if (this.form.length == 0)
            console.error('form cannot be found');
        this.publish_button = this.form.find('input#publish');
        if (this.publish_button.length == 0)
            console.error('publish_button cannot be found');
        this.error_msgs = jQuery('<div id="error-messages" class="error"></div>')
            .insertAfter('h2:first').hide();
        // event handlers
        var _this = this;
        this.publish_button.click(function(){
            _this.publish_button_clicked = true;
        });
        this.form.submit(function(){
            if (_this.validate_ok)  // do submit upon validation pass
                return true;
            _this.validate_data();
            return false;
        });
    },

    validate_data: function() {
        // suppress dup-call
        if (this.disabled)
            return;
        this.disabled = true;
        // prepare post data
        // need to remove&replace 'action' key
        var _data = this.form.serializeArray();
        var data = [];
        jQuery(_data).each(function(i,v){
            if (v.name != 'action')
                data.push(v);
        });
        data.push({name:'action', value:'validate_data'});
        var _this = this;
        jQuery.post(ajaxurl, data, function(res) {  // ajaxurl is a WP global var
            console.log(res);
            // if validation error
            if (res.error_html) {
                var dom = _this.error_msgs;
                dom.hide('fast');
                dom.html(res.error_html);
                dom.show('fast');
                _this.publish_button_clicked = false;  // reset
                _this.enable_submit_button();
            // on validation pass
            } else {
                _this.validate_ok = true;
                // need this button click emulation to
                // add submit button's name/value to
                // post data ($_POST['publish'] = 'Publish')
                if (_this.publish_button_clicked)
                    _this.publish_button.click();
                else
                    _this.form.submit();
            }
            _this.disabled = false;  // unlock dup-call
        }, 'json');
    },

    enable_submit_button: function() {
        // save-draft button
        this.form.find('img#draft-ajax-loading').css('visibility', 'hidden');
        this.form.find('input#save-post').removeClass('button-disabled');
        // publish button
        this.form.find('img#ajax-loading').css('visibility', 'hidden');
        this.form.find('input.button-primary').removeClass('button-primary-disabled');
    }
};

// main
var myapp;
jQuery(function(){
    myapp = new MyApp_Admin();
});


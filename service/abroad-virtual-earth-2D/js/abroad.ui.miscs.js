// everything wrapped in jQuery -
// same effect as jQuery.noConflict() for use with prototype.js
(function($){


// define parent classes
if( typeof( ABROAD ) != 'function' ) {
    ABROAD = function (){};
}
if( typeof( ABROAD.UI ) != 'function' ) {
    ABROAD.UI = function (){};
}

//
// ABROAD.UI.Places
//
//if( typeof( ABROAD.UI.Places ) != 'function' ) {
//    ABROAD.UI.Places = function (){
//        if( typeof( ABROAD_MASTER_PLACES ) != 'object' ){
//            alert( 'abroad.master.places.js が読み込まれていません' );
//            return undefined;
//        }
//    };
//}

//
// ABROAD.UI.Dept.Pulldown
//
if( typeof( ABROAD.UI.Dept ) != 'function' ) {
    ABROAD.UI.Dept = function (){};
}
ABROAD.UI.Dept.Pulldown = function() {
    this.constructor.apply(this, arguments);
};
ABROAD.UI.Dept.Pulldown.prototype = {
    constructor: function ( hash ){
        var prm = $.extend({
            id             : 'ab-sel-dept',
            first_opt_text : '指定なし',
            attr_name      : 'dept',
            elm            : undefined
        }, hash );
        $.extend( this, prm );
        // select elements
        this.elm = $( '#' + this.id );
        // error check
        if( this.elm.length == 0 ){
            alert( 'ABROAD.UI.Dept.Pulldown\n'
                + '出発地のプルダウンが見つかりません\n'
                + 'id: ' + this.id );
            return undefined;
        }
        // append name attribute if not set
        if( this.elm.length && !this.elm.attr( 'name' ) ){
            this.elm.attr( 'name', this.attr_name );
        }
    },
    init: function ( arg ){
        var prm = $.extend({
            val : undefined
        }, arg);
        this.update_ui( prm.val );
    },
    defs: function (){
        var h = {
            'TYO' : '東京',
            'NGO' : '名古屋',
            'OSA' : '大阪',
            'FUK' : '福岡',
            '999' : 'その他'
        };
        return h;
    },
    update_ui: function ( default_val ){
        var pull  = this.elm;
        var defs  = this.defs();
        var _inst = this;
        this._reset_pulldown( pull );
        $.each( defs, function (code){
            var itm = defs[ code ];
            var opt = document.createElement( "OPTION" );
            opt.value = code;
            if( code == default_val ){
                opt.selected = true;
            }
            var label = _inst._create_option_label( itm );
            var txt = document.createTextNode( label );
            $( opt ).append( txt );
            pull.append( opt );
        }); 
    },
    _reset_pulldown: function ( elm ){
        if( !elm ){ return }
        elm.empty();
        elm.append( '<option value="">'
            + this.first_opt_text + '</option>' );
    },
    _create_option_label: function ( itm ){
        return itm;
    }
};

// end of jQuery no-conflict wrapper
})(jQuery);

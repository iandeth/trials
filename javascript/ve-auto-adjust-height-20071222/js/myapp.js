(function($){

MyApp = function() {
    this.constructor.apply( this, arguments );
};
MyApp.prototype = {
    constructor: function ( hash ){
        var prm = $.extend({
        }, hash );
        this.resize_window_height();
        $( window ).resize( this.resize_window_height );
    },
    resize_window_height: function (){
        var h = {
            doc : 0,
            hd  : 10 + 10 + 0,      // add top + bottom padding
            ft  : 5 + 5 + 0,        // add top + bottom padding
            navi_head : 5 + 5 + 0,  // add top + bottom padding
            navi_pads : 5 * 5,      // extra layout padding
            map_pads  : 5 * 4,      // extra layout padding
            navi_unknown : 32,      // for div with scrollbars (?)
            trivials : 1            //for firefox hiding scrollbars
        };
        if( $.browser.opera ){
            h.doc = document.body.clientHeight;
        }else if( $.browser.safari ){
            h.doc = window.innerHeight;
        }else if( $.browser.msie ){
            h.doc = document.documentElement.clientHeight;
            h.trivials = 0;
        }else{
            h.doc = document.documentElement.clientHeight;
        }
        h.navi_head = h.navi_head + $( 'div.navi > .head' ).height();
        h.hd = h.hd + $( '#hd' ).height();
        h.ft = h.ft + $( '#ft' ).height();
        
        var navi_val = h.doc - h.hd - h.ft - h.navi_pads
            - h.navi_head - h.navi_unknown - h.trivials;
        var map_val = h.doc - h.hd - h.ft - h.map_pads - h.trivials;
        $( '#navi-cont' ).height( navi_val );
        $( '#vearth' ).height( map_val );

        if( $.debug() ){
            $.log( 'doc:' + h.doc );
            $.log( 'navi_head: ' + h.navi_head );
            $.log( 'navi_pads: ' + h.navi_pads );
            $.log( 'hd: ' + h.hd );
            $.log( 'ft: ' + h.ft );
            $.log( 'result navi_val:' + navi_val );
            $.log( 'result map_val:' + map_val );
        }
    }
}

})(jQuery);

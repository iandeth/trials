var HikakuApp = function (){
    this.entries = $( 'div.entry' );
    this.selected_ids = {};
    this.add_checkbox();
    this.add_hikaku_btn();
};
HikakuApp.prototype = {
    add_checkbox : function (){
        var _self = this;
        $.each( this.entries, function ( i, itm ){
            var _itm = $( itm );
            var id  = _itm.attr( 'id' ).match( /[^-]+$/ )[0];
            var tgt = _itm.find( 'blockquote.tourpoint' ); 
            $( '<div><input type="button" name="' + id
                + '" value="”äŠrŒó•â‚É’Ç‰Á" id="hijack-ids"/></div>' )
                .css({
                    clear:'both',
                    'text-align':'right',
                    'padding-top': '10px'
                })
                .find( 'input[type=button]' )
                .click( function (){
                    _self.selected_ids[ id ] = { 'id': id };
                    $( itm ).css( 'background', '#999' );
                    $( this ).attr( 'disabled', 'true' );
                })
                .end()
                .insertAfter( tgt );
        });
    },
    add_hikaku_btn: function (){
        var _self = this;
        var b_top = $( '<div><input type="button" id="show_hikaku" value='
            + '"Œó•â‚ð•À‚×‚Ä”äŠr‚·‚é"/></div>' )
            .find( 'input[type=button]' )
            .click( function (){
                var arr = [];
                $.each( _self.selected_ids, function (k,v){
                    arr.push( k );
                });
                alert( arr.join( '\n' ) );
            }).end();
        var b_btm = b_top.clone( true );
        b_btm.attr( 'id', 'show_hikaku_btm' );
        b_top.css({
                'text-align':'right',
                'margin': '20px 0 10px 0'
        });
        b_btm.css({
                'text-align':'right',
                'margin': '10px 0 20px 0'
        });
        b_top.insertBefore( 'div.entries' )
        b_btm.insertAfter( 'div.entries' );
    }
};

// and execute
var myapp = new HikakuApp();

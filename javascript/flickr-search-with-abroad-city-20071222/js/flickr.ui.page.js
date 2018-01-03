// DataPage library - auto generate helpful information for pagination
// version 1.0
// created by:
// Toshimasa Ishibashi
// iandeth [at] gmail.com

// I imported the code from Perl's CPAN module - Data::Page -
// originally created by Leon Bracard. Thanks Leon for a
// useful module.
// http://search.cpan.org/dist/Data-Page/

// Changes
// 2007-08-21
//   * v1.0 released

if( typeof( Data ) != 'function' ) {
    Data = function (){};
}

Data.Page = function() {
    this.initialize.apply(this, arguments);
};
Data.Page.prototype = {
    initialize: function ( total_entries, entries_per_page, current_page ){
        this._total_entries    = 0;
        this._entries_per_page = 10;
        this._current_page     = 1;
        this.total_entries( total_entries );
        this.entries_per_page( entries_per_page );
        this.current_page( current_page );
    },
    total_entries: function ( int ){
        int = parseInt( int );
        if ( int ){
        this._total_entries = int;
        }
        return this._total_entries;
    },
    entries_per_page: function ( int ){
        int = parseInt( int );
        if ( int ){
        this._entries_per_page = int;
        }
        return this._entries_per_page;
    },
    current_page: function ( int ){
        int = parseInt( int );
        if ( int ){
        this._current_page = int;
        }
        return this._current_page;
    },
    entries_on_this_page: function (){
        if( this.total_entries() == 0 ){
        return 0;
        }
        return this.last() - this.first() + 1;
    },
    first_page: function (){
        return 1;
    },
    last_page: function (){
        var pages = this.total_entries() / this.entries_per_page();
        var last_page = 1;
        if( pages == parseInt( pages ) ){
        last_page = pages;
        }else{
        last_page = 1 + parseInt( pages );
        }
        if( last_page < 1 ){
        last_page = 1;
        }
        return last_page;
    },
    first: function (){
        if( this.total_entries() == 0 ){
        return 0;
        }
        return ( ( this.current_page() - 1 ) * this.entries_per_page() ) + 1;
    },
    last: function (){
        if( this.current_page() == this.last_page() ){
        return this.total_entries();
        }
        return this.current_page() * this.entries_per_page();
    },
    previous_page: function (){
        if( this.current_page() > 1 ){
        return this.current_page() - 1;
        }
        return undefined;
    },
    next_page: function (){
        if( this.current_page() < this.last_page() ){
        return this.current_page() + 1;
        }
        return undefined;
    },
    splice: function ( arr ){
        var top = arr.length;
        if( arr.length > this.last() ){
        top = this.last();
        }
        if( top == 0 ){
        return [];
        }
        var ret = [];
        var from = this.first() - 1;
        var to   = top - 1;
        for( var i=0; i<arr.length; i++ ){
        if( i < from ){ continue; }
        if( i > to ){ break; }
        ret.push( arr[i] );
        }
        return ret;
    },
    skipped: function (){
        var skipped = this.first() - 1;
        if( skipped < 0 ){
        return 0;
        }
        return skipped;
    }
};


/*
NAME:

    Flickr.UI.Page - auto generate helpful info for pagination

VERSION:

    1.0

SYNOPSIS:

    function my_ajax_callback ( result ){
        // assuming we did an ajax request to fetch
        // results from 11 - 20 out of 56 total items.
        // function argument 'result' is the response
        // data retrieved from Flickr Web Service,
        // either a javascript object (json) or a XMLDocument (xml).

        var page = Flickr.UI.Page( result );

        // these are the available information
        alert( page.current_page() );      // 2
        alert( page.first_page() );        // 1
        alert( page.last_page() );         // 6
        alert( page.next_page() );         // 3
        alert( page.previous_page() );     // 1
        alert( page.total_entries() );     // 56
        alert( page.first() );             // 11
        alert( page.last() );              // 20
        alert( page.entries_per_page() );  // 10

        // typical usage
        document.getElementById( 'status' ).innerHTML =
        page.total_entries() + ' items found.'
        + ' Displaying ' + page.current_page()
        + ' of ' + page.last_page() ' pages.';

        // get params for pagination ajax request
        var np = page.next_page_param();     // { page:3, per_page:10 }
        var pp = page.previous_page_param(); // { page:1, per_page:10 }
        var xp = page.page_param( 5 );       // { page:5, per_page:10 }
    }

DESCRIPTION:

    This module will create some useful data for displaying
    paging information, when creating some ajax application
    using Flickr API.
    http://www.flickr.com/services/api/

AUTHOR:

    Toshimasa Ishibashi
    iandeth [at] gmail.com

CHANGES:

    2007-12-04
        - v1.0 released
*/

if( typeof( Flickr ) != 'function' ) {
    Flickr = function (){};
}
if( typeof( Flickr.UI ) != 'function' ) {
    Flickr.UI = function (){};
}

Flickr.UI.Page =
function ( data, count ){
    if( typeof( data ) != 'object' ){ return undefined }
    this.initialize.apply( this, arguments );
}

Flickr.UI.Page.prototype = new Data.Page();

Flickr.UI.Page.prototype.initialize =
function ( data ){
    if( typeof( data )        != 'object' ){ return undefined }
    if( typeof( data.photos ) != 'object' ){ return undefined }

    var root = data.photos;
    var total = parseInt( root.total ) || 0;
    var count = parseInt( root.perpage ) || 10;
    var curr  = parseInt( root.page ) || 1;

    this.total_entries( total );
    this.entries_per_page( count );
    this.current_page( curr );
    this._response_data = data;
    return this;
};

Flickr.UI.Page.prototype.page_param =
function ( page, hash ){
    page = parseInt( page );
    if( !page ){ return undefined }
    if( !hash ){ hash = {} }
    hash.per_page = this.entries_per_page();
    hash.page = page;
    return hash;
}

Flickr.UI.Page.prototype.next_page_param =
function ( hash ){
    return this.page_param( this.next_page(), hash );
}

Flickr.UI.Page.prototype.previous_page_param =
function ( hash ){
    return this.page_param( this.previous_page(), hash );
}

//
// Flickr.UI.Page.Simple
//
Flickr.UI.Page.Simple =
function ( data, count ){
    if( typeof( data ) != 'object' ){ return undefined }
    this.bid = 'flickr';     // bid = 媒体ID
    this.cnm = 'Flickr'; // cnm = ベースのクラス名
    this.initialize.apply( this, arguments );
}

Flickr.UI.Page.Simple.prototype = new Flickr.UI.Page();

Flickr.UI.Page.Simple.prototype.paginate =
function ( hash ){
    var _self = this;
    var def_request = function ( s ){
        alert( _self.cnm + '.UI.Page.Simple.paginate()\n'
        + 'no callback function specified. start = ' + s );
    };
    var prm = $.extend({
        id: this.bid + '-page',
        template: '',
        template_type: 0,
        request: def_request,
        request_args: {},
        sub_uis: []
    }, hash );
    // 対象要素判定
    var uis = [
        { 
            id: prm.id,
            template: prm.template,
            template_type: prm.template_type
        }
    ];
    $.each( prm.sub_uis, function ( i, itm ){
        if( itm.id == undefined ){ return true }
        uis.push( itm ); 
    });
    // テンプレート判定
    $.each( uis, function ( i, itm ){
        itm.my_tmpl = '';
        if( itm.template != undefined && itm.template != '' ){
            itm.my_tmpl = itm.template;
        }else{
            itm.my_tmpl = _self._get_template( itm.template_type, prm );
        }
        if( typeof( itm.my_tmpl ) == 'string' ){
            itm.tmpl_is = 'string';
        }else{
            itm.tmpl_is = 'jquery_object';
        }
    });
    // UI生成
    var _self = this;
    $.each( uis, function ( i, ui ){
        // validate
        var tgt = $( '#' + ui.id );
        if( tgt.length == 0 ){
            alert( _self.cnm + '.UI.Page.Simple\n'
            + 'ID値 ' + ui.id + ' の要素が見つかりません' );
            return false;
        }
        tgt.empty();
        var html = ui.my_tmpl;
        // replace <#*> tags
        var res = {};
        if( ui.tmpl_is == 'string' ){
            var replace_tags = {
                'te' : _self.total_entries(),
                'cp' : _self.current_page(),
                'lp' : _self.last_page(),
                'fi' : _self.first(),
                'li' : _self.last()
            };
            $.each( replace_tags, function ( k, v ){
                 html = html.replace( new RegExp( "<#" + k + ">", "g" ), v );
            });
            res = $( '<span class="temporary-wrapper">'
                + html + '</span>' );
        }else{
            res = html; // already a jQuery object
        }
        // set navigation callback
        if( _self.previous_page() ){
            var prevpp = _self.previous_page_param();
            res.find( "." + _self.bid + "-page-back > a:first" )
                .click( function (){
                    prm.request( prevpp.page, prm.request_args );
                    return false;
                });
        }else{
            res.find( "." + _self.bid + "-page-back" ).remove(); 
        }
        if( _self.next_page() ){
            var nextpp = _self.next_page_param();
            res.find( "." + _self.bid + "-page-next > a:first" )
                .click( function (){
                    prm.request( nextpp.page, prm.request_args );
                    return false;
                });
        }else{
            res.find( "." + _self.bid + "-page-next" ).remove(); 
        }
        // append to target
        if( ui.tmpl_is == 'string' ){
            res.contents().appendTo( tgt );
        }else{
            res.appendTo( tgt );
        }
    });
    return true;
}

Flickr.UI.Page.Simple.prototype._get_template =
function ( id, prm ){
    var b = this.bid; 
    if( id == 'no_space' ){
        var tmpl = 
            '<span class="' + b + '-page-total">'
            + '<span class="' + b + '-page-total-count"><#te></span> 件'
            + '見つかりました</span>'
            + '<span class="' + b + '-page-back"><a href="">'
            + '&lt;&lt;前へ</a></span>'
            + '<span class="' + b + '-page-info"><#cp> / <#lp> '
            + 'ページ</span>'
            + '<span class="' + b + '-page-next"><a href="">'
            + '次へ&gt;&gt;</a></span>';
        return tmpl;
    }else if( id == 'float_right' ){
        var tmpl = 
            '<div class="' + b + '-page-navi" style="float:right">'
            + '<span class="' + b + '-page-back"><a href="">'
            + '&lt;&lt;前へ</a>&nbsp;&nbsp;</span>'
            + '<span class="' + b + '-page-info"><#cp> / <#lp> '
            + 'ページ</span>'
            + '<span class="' + b + '-page-next">&nbsp;&nbsp;<a href="">'
            + '次へ&gt;&gt;</a></span>'
            + '</div>'
            + '<div class="' + b + '-page-total">'
            + '<span class="' + b + '-page-total-count"><#te></span> 件'
            + '見つかりました</div>';
        return tmpl;
    }else if( id == 'float_right_2rows' ){
        var tmpl = 
            '<div class="' + b + '-page-total">'
            + '<span class="' + b + '-page-total-count"><#te></span> 件'
            + '見つかりました</div>'
            + '<div class="' + b + '-page-navi" style="text-align:right">'
            + '<span class="' + b + '-page-back"><a href="">'
            + '&lt;&lt;前へ</a>&nbsp;&nbsp;</span>'
            + '<span class="' + b + '-page-info"><#cp> / <#lp> '
            + 'ページ</span>'
            + '<span class="' + b + '-page-next">&nbsp;&nbsp;<a href="">'
            + '次へ&gt;&gt;</a></span>'
            + '</div>';
        return tmpl;
    }else if( id == 'pulldown' ){
        var tmpl = '<select class="' + b + '-page-sel">';
        for( var i=1; i<=this.last_page(); i++ ){ 
            var pp = this.page_param( i );
            tmpl += '<option value="' + pp.page + '"';
            if( this.current_page() == i ){
                tmpl += ' selected="selected"';
            }
            tmpl += '>' + i + ' ページ</option>';
        }
        tmpl += '</select>';
        tmpl = $( tmpl );
        tmpl.change( function (){
            prm.request( $( this ).val() , prm.request_args );
        });
        return tmpl;
    }else{
        var tmpl = 
            '<span class="' + b + '-page-total">'
            + '<span class="' + b + '-page-total-count"><#te></span> 件'
            + '見つかりました</span>&nbsp;&nbsp;&nbsp;&nbsp;'
            + '<span class="' + b + '-page-back"><a href="">'
            + '&lt;&lt;前へ</a></span>' + '&nbsp;&nbsp;'
            + '<span class="' + b + '-page-info"><#cp> / <#lp> '
            + 'ページ</span>' + '&nbsp;&nbsp;'
            + '<span class="' + b + '-page-next"><a href="">'
            + '次へ&gt;&gt;</a></span>';
        return tmpl;
    }
}

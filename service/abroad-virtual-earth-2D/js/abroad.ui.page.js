// DataPage library - auto generate helpful information for pagination
// version 1.0
// created by:
// Toshimasa Ishibashi
// iandeth99@ybb.ne.jp

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

	ABROAD.UI.Page - auto generate helpful info for pagination

VERSION:

	1.0

SYNOPSIS:

	function my_ajax_callback ( result ){
		// assuming we did an ajax request to fetch
		// results from 11 - 20 out of 56 total items.
		// function argument 'result' is the response
		// data retrieved from AB-ROAD Web Service,
		// either a javascript object (json) or a XMLDocument (xml).

		var entries_per_page = 10;
		var page = ABROAD.UI.Page( result, entries_per_page );

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
		var np = page.next_page_param();     // { start:21, count:10 }
		var pp = page.previous_page_param(); // { start:1,  count:10 }
		var xp = page.page_param( 5 );       // { start:41, count:10 }
	}

DESCRIPTION:

	This module will create some useful data for displaying
	paging information, when creating some ajax application
	using with AB-ROAD Web Service.
	http://webservice.recruit.co.jp/ab-road/

AUTHOR:

	Toshimasa Ishibashi
	iandeth99@ybb.ne.jp

CHANGES:

	2007-08-21
		- v1.0 released
*/

if( typeof( ABROAD ) != 'function' ) {
	ABROAD = function (){};
}
if( typeof( ABROAD.UI ) != 'function' ) {
	ABROAD.UI = function (){};
}

ABROAD.UI.Page =
function ( data, count ){
	var start = 1;
	var total = 0;
	if( !count ){ count = 10 };

	if( typeof( data ) != 'object' ){ return undefined }

	if( !$.browser.msie && data instanceof XMLDocument ){
		var elms = data.getElementsByTagName( 'results_start' );
		if( elms[0].firstChild ){
			start = parseInt( elms[0].firstChild.nodeValue );
		}
		var elmt = data.getElementsByTagName( 'results_available' );
		if( elmt[0].firstChild ){
			total = parseInt( elmt[0].firstChild.nodeValue );
		}
	}else if( typeof( data.results ) == 'object' ){
		var root = data.results;
		var ints = parseInt( root.results_start );
		var intt = parseInt( root.results_available );
		if( ints ){ start = ints }
		if( intt ){ total = intt }
	}else if( data.start && data.total ){
		var ints = parseInt( data.start );
		var intt = parseInt( data.total );
		if( ints ){ start = ints }
		if( intt ){ total = intt }
	}

	var current_page = ( start - 1 ) / count + 1;
	if( current_page < 1 ){ current_page = 1 }

	this.total_entries( total );
	this.entries_per_page( count );
	this.current_page( current_page );
	return this;
};

ABROAD.UI.Page.prototype = new Data.Page();

ABROAD.UI.Page.prototype.page_param =
function ( page, hash ){
	page = parseInt( page );
	if( !page ){ return undefined }
	if( !hash ){ hash = {} }
	hash.count = this.entries_per_page();
	hash.start = ( page - 1 ) *
		this.entries_per_page() + 1;
	return hash;
}

ABROAD.UI.Page.prototype.next_page_param =
function ( hash ){
	return this.page_param( this.next_page(), hash );
}

ABROAD.UI.Page.prototype.previous_page_param =
function ( hash ){
	return this.page_param( this.previous_page(), hash );
}

var MyApp = Class.create({
    initialize: function ( arg ){
        if( typeof arg != 'object' ){ arg = {} }
        this.prm = $.extend({
            count: 12,
            start: 1,
            male : 0
        }, arg );
        // auto relocate to static page if Safari v2.0.x
        if( navigator.userAgent.match( /WebKit\/4/ ) ){
            this.relocate_to_static_page();
        }
        // query parameter for this page
        // this.query = this.parse_query_string();
        // ajax driver
        this.drv = this.get_driver();
        // dom elements
        this.elm = {
            results: $( '#results' )
        };
        // definition for serial ajax requesting
        this.ajax_chain = {
            SA: { next:'SB', pos:'first' },
            SB: { next:'SC', pos: ''     },
            SC: { next:'',   pos: 'last' }
        };
        // flaw status properties
        this.state = {};
        this.reset_state();
        // dom element exist check
        if( this.elm.results.length == 0 ){
            alert( 'element with id="results" does not exist' );
            return false;
        }
        // jquery tooltip plugin
        $.Tooltip.defaults = $.extend( $.Tooltip.defaults, {
            delay      : 1,
            showURL    : false,
            showBody   : " - ",
            track      : false,
            extraClass : "tips",
            left       : -20
        });
        // failer handler
        this.timeout_id = {};
        // true for showing ajax paging button
        this.show_more = arg.show_more || false;
        // do ajax request for Tokyo (SA)
        this.do_ajax_get();
    },
    get_driver: function (){
        Recruit.UI.key = '-';
        var drv = new Recruit.UI.Driver.JSONP({
            //url: 'http://webservice.recruit.co.jp/beauty/style-imo/bridge.cgi',
            url: 'bridge.cgi',
            prm: this.prm
        });
        return drv;
    },
    do_ajax_get: function ( sva ){
        if( sva == undefined ){ sva = 'SA' }
        var _self = this;
        // register ajax failer handler
        this.timeout_id[ sva ] = setTimeout( function (){
            if( _self.state.photos.load_count == 0 ){
                _self.relocate_to_static_page();
            }
        }, 7000 );
        // ajax request
        this.drv.get( function (){
            _self.on_ajax_get.apply( _self, arguments );
        }, { service_area: sva } );
    },
    on_ajax_get: function ( success, json, prm ){
        var sva = prm.service_area;
        // clear failer handler
        clearTimeout( this.timeout_id[ sva ] );
        // error check
        if( !success ){
            //alert( sva + '\n' + json.results.error[0].message );
            this.relocate_to_static_page();
            return false;
        }
        // has next page check
        var page = new Recruit.UI.Page( json, this.prm.count );
        if( page.next_page() ){
            this.state.page.has_next = true;
        }
        // ajax chain definition
        var cdef = this.ajax_chain[ sva ];
        // if first area block
        if( cdef.pos == 'first' ){
            this.elm.results.empty();  // reset loading image
            this.write_header( json );
        }
        // write photo contents
        this.write_each_sva_photos( json );
        // if last area block
        if( cdef.pos == 'last' ){ 
            // if no photos where found
            if( this.state.photos.load_count == 0 ){
                this.relocate_to_static_page();
            }
            // add clear line if not ended at pos wrap
            if( this.state.pos.current != 1 ){
                var cf = this.get_clear_float();
                this.elm.results.append( cf );
            }
            // write footer
            this.write_footer( json );
        }
        // chain ajax get
        if( cdef.next ){
            this.do_ajax_get( cdef.next ); 
        }
    },
    write_header: function ( json ){
        //var tgt = this.elm.results;
    },
    write_each_sva_photos: function ( json ){
        var tgt = this.elm.results;
        var _self = this;
        $.each( json.results.style || [], function (i,r){
            var c = $( '<div></div>' ).addClass( 'each-style' );
            if( _self.is_pos_wrap() ){
                c.addClass( 'at-wrap' );
            }else if( _self.is_pos_begin() ){
                c.addClass( 'at-begin' );
            }
            var p = $( '<div></div>' ).addClass( 'photo' );
            var a = $( '<a></a>' ).attr({
                // href: r.salon.urls.pc.replace( /B_20100/, 'B_20400' ),
                href: r.urls.pc.replace( /\?vos=/, '' ),
                target: '_blank'
            });
            $( '<img>' )
                .attr({
                    'src'   : r.photo.front.m2,
                    'title' : r.name,
                    'width' : '154',
                    'height': '205'
                })
                .addClass( 'photo-img' )
                .hover(
                    function (){
                        $( this ).addClass( 'img-hover' );
                    }, function (){
                        $( this ).removeClass( 'img-hover' );
                    }
                )
                .Tooltip()
                .appendTo( a );
            p.append( a );
            c.append( p );
            var t = $( '<div></div>' ).addClass( 'desc' );
            //t.append( r.salon.service_area.name );
            t.append( '<img width="74" height="15" src="design/image/'
                + 'icon_' + r.salon.service_area.code  + '.gif">' );
            c.append( t );
            tgt.append( c );
            if( _self.is_pos_wrap() ){
                var cf = _self.get_clear_float();
                tgt.append( cf );
            }
            _self.increment_pos();
            _self.state.photos.load_count++;
        });
    },
    write_footer: function ( json ){
        var tgt = this.elm.results;
        var _self = this;
        if( this.show_more ){
            if( this.state.page.has_next ){
                // show more photos button
                $( '<div><input type="button" value="more"></div>' )
                    .css({ 'margin':'10px' })
                    .find( 'input' )
                    .css({ 'font-size':'1.5em' })
                    .click( function (){
                        _self.do_ajax_get_next_page();
                        return false;
                    }).end()
                    .appendTo( tgt );
            }else{
                // show end message
                var url = window.location.href;
                $( '<div><a href="' + url + '">&gt;&gt; back to first set'
                    + '</a></div>' )
                    .css({ 'margin':'10px' })
                    .css({ 'font-size':'1.5em' })
                    .appendTo( tgt );
            }
        }
    },
    increment_pos: function (){
        this.state.pos.current += 1;
        if( this.state.pos.current > this.state.pos.wrap_at ){
            this.state.pos.current = 1;
        }
    },
    is_pos_wrap: function (){
        if( this.state.pos.current == this.state.pos.wrap_at ){
            return true;
        }
        return false;
    },
    is_pos_begin: function (){
        if( this.state.pos.current == 1 ){
            return true;
        }
        return false;
    },
    get_clear_float: function (){
        return $( '<div></div>' ).css({ clear:'both', height:'25px' });
    },
    relocate_to_static_page: function (){
        window.location.href = "result.html";
    },
    reset_state: function (){
        // each photo display row position
        this.state.pos = {
            current: 1,
            wrap_at: 4
        };
        // overall photos loaded
        this.state.photos = {
            load_count: 0
        };
        // for displaying "more" button
        this.state.page = {
            has_next: false
        }
        // reset content
        this.elm.results.empty();
        // add loading image
        var div = $( '<div></div>' ).css({
            'margin' : '50px',
            'text-align' : 'center',
            'font-size' : '0.9em'
        });
        div.append( '<img src="img/loading.gif">' );
        div.append( ' loading...' );
        this.elm.results.append( div );
    },
    do_ajax_get_next_page: function (){
        this.prm.start = this.prm.start + this.prm.count;
        this.drv = this.get_driver();
        this.reset_state();
        this.do_ajax_get();
    },
    parse_query_string: function (){
        var q = window.location.href;
        if( q.match( /\?/ ) == undefined ){
            return {};
        }
        var str = window.location.href.match( /^[^?]+\?(.+?)$/ )[1];
        var arr = str.split( '&' );
        var ret = {};
        $.each( arr, function( i, v ){
            var kv = v.split( '=' );
            var k = decodeURIComponent( kv[0] );
            var v = decodeURIComponent( kv[1] );
            if( ret[ k ] != undefined ){
                ret[ k ] = [ ret[ k ] ];
                ret[ k ].push( v );
            }else{
                ret[ k ] = v;
            }
        });
        return ret;
    }
});

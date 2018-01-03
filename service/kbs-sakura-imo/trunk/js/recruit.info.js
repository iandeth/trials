(function ($){  // everything wrapped with jQuery

if( typeof Recruit != 'function' ){
    Recruit = function (){};
}
Recruit.Info = function (){
    this.initialize.apply( this, arguments );
};
Recruit.Info.prototype = {
    initialize: function ( arg ){
        if( typeof arg != 'object' ){ arg = {} }
        if( !arg.latlng ){ arg.latlng = [] }
        // ignore Safari v2.0.x
        if( navigator.userAgent.match( /WebKit\/4/ ) ){
            return false;
        }
        // properties
        this.title = arg.title || 'この場所';
        this.api_key = {
            hotpepper : '7b18731dfad050ca',
            jalan     : 'ari118363b1726'
        };
        this.elm = {
            results   : $( '#recr-results' ),
            hotpepper : undefined,
            jalan     : undefined
        };
        this.geo = {
            lat: arg.latlng[0],
            lng: arg.latlng[1]
        };
        // 中心点をランダム変化
        this.geo.lat += ( Math.floor( Math.random() * 80 ) / 10000 );
        this.geo.lng += ( Math.floor( Math.random() * 100 ) / 10000 );
        // geo code check
        if( !this.geo.lat || !this.geo.lng ){
            alert( 'lat and lng not specified' );
            return false;
        }
        // dom element exist check
        if( this.elm.results.length == 0 ){
            alert( 'element with id="results" does not exist' );
            return false;
        }
        // do ajax request for HotPepper
        this.do_ajax_hotpepper();
    },
    init_canvas: function (){
        var tgt = this.elm.results;
        tgt.empty();
        // jalan
        var jal = $( '<div></div>' )
            .attr( 'id', 'recr-jalan' )
            .addClass( 'recr-results-col' );
        var inner = $( '<div></div>' )
            .addClass( 'recr-results-col-inner' );
        jal.append( inner );
        tgt.append( jal );
        this.elm.jalan = inner;
        // right margin
        jal.css( 'margin-right', '10px' );
        // hotpepper
        var hpp = $( '<div></div>' )
            .attr( 'id', 'recr-hotpepper' )
            .addClass( 'recr-results-col' );
        var inner = $( '<div></div>' )
            .addClass( 'recr-results-col-inner' );
        hpp.append( inner );
        tgt.append( hpp );
        this.elm.hotpepper = inner;
    },
    // HOTPEPPER API
    do_ajax_hotpepper: function (){
        var _self = this;
        var prm = {
            key    : this.api_key.hotpepper,
            format : 'jsonp',
            count  : 5,  // 5件表示
            range  : 5,  // 半径3km以内
            lat    : this.geo.lat,
            lng    : this.geo.lng
        };
        var url = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?callback=?';
        $.getJSON( url, prm, function ( json ){
            var res = json.results;
            // error check
            var is_error = false;
            var error_msg = '';
            if( res.error ){
                is_error = true;
                error_msg = res.error[0].message;
            }else if( res.results_available == "0" ){
                is_error = true; 
                error_msg = 'no shops found';
            }
            if( is_error ){
                if( console ){ console.log( error_msg ) }
                _self.do_ajax_jalan(); // do next ajax
                return false;
            }
            // clear default content
            _self.init_canvas();
            // draw content
            _self.draw_hotpepper( res.shop );
            // do next ajax
            _self.do_ajax_jalan();
        });
    },
    draw_hotpepper: function ( shops ){
        var tgt = this.elm.hotpepper;
        tgt.append( '<p>' + this.title + '周辺のグルメ情報</p>' );
        var ul = $( '<ul></ul>' );
        $.each( shops, function (i,d){
            var li = $( '<li></li>' );
            li.append( '<a href="' + d.urls.pc + '">'
                + d.name + '</a>' );
            ul.append( li );
        });
        tgt.append( ul );
    },
    // JALAN API
    do_ajax_jalan: function (){
        var _self = this;
        var prm = {
            key    : this.api_key.jalan,
            count  : 5,  // 5件表示
            range  : 3,  // 半径3km以内
            lat    : this.geo.lat,
            lng    : this.geo.lng
        };
        var url = 'jalan_bridge.cgi';
        //var url = 'http://mtl.recruit.co.jp/sandbox/toshi_i/kbs-sakura-imo/jalan_bridge.cgi';
        url += '?callback=?';  // do jsonp
        $.getJSON( url, prm, function ( json ){
            // error check
            if( json.Error ){
                if( console ){ console.log( json.Error.Message ) }
                return false;
            }
            // draw content
            _self.draw_jalan( json.Results.Hotel );
        });
    },
    draw_jalan: function ( hotels ){
        var tgt = this.elm.jalan;
        tgt.append( '<p>' + this.title + '周辺の宿・ホテル情報</p>' );
        var ul  = $( '<ul></ul>' );
        $.each( hotels, function (i,d){
            var li = $( '<li></li>' );
            li.append( '<a href="' + d.HotelDetailURL + '">'
                + d.HotelName + '</a><br />' );
            ul.append( li );
        });
        tgt.append( ul );
    }
};

})(jQuery);

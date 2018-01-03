var MyApp = function (){
    this.init.apply( this, arguments );
};
MyApp.prototype = {

    // コンストラクタ
    init : function (){
        var _self = this;
        this.elm = {
            page:   $( '#flickr-page' ),
            page_bottom: $( '#flickr-page-bottom' ),
            result: $( '#result' ),
            result_misc: $( '#result-misc' ),
            pnum:   $( 'form#flickr > input[name=page]' ),
            sel_area: $( '#ab-area-sel' ),
            sel_country: $( '#ab-country-sel' ),
            sel_city: $( '#ab-city-sel' ),
            tags: $( 'form#flickr > input[name=tags]' )
        };
        // AJAX キャッシュ
        this.ajax_cache = {};
        // 最後に検索したクエリ情報
        this.last_query = {
            tags : '',
            keywords : ''
        };
        // APIキーをinputにセット
        $( 'form#flickr > input[name=api_key]' ).val( api_key );
        // フォーム送信時のハンドラ
        $( 'form#flickr' ).submit( function(){
            _self.elm.pnum.val( 1 );    
            // _self.ajax_cache = {}; // AJAXキャッシュリセット
            var param = _self.get_api_param();
            _self.ajax_get_list( param );
            return false;
        });
        // AB-ROAD UI Library
        this.places = new ABROAD.UI.Places.Pulldown();
        this.places.init();
    },

    // AJAXリクエスト用 URL 生成
    get_api_param : function (){
        this.elm.tags.val( '' );
        var ar = this.elm.sel_area.val();
        var co = this.elm.sel_country.val();
        var ci = this.elm.sel_city.val();
        var k  = 'name';
        var itm;
        if( ci ){
            itm = this.places.find_place({ city: ci });
        }else if( co ){
            itm = this.places.find_place({ country: co });

        }else if( ar ){
            itm = this.places.find_place({ area: ar });
            if( ar == 'CAF' ){
                itm.name = 'アフリカ';
            }
        }
        if( !itm || !itm.name ){
            var param = $( 'form#flickr' ).formSerialize();
            return param;
        }
        var arr = [];
        if( itm.name_en ){ arr.push( itm.name_en ) }
        if( itm.name )   { arr.push( itm.name ) }
        var tag = arr.join( ',' );
        tag = tag.replace( /[ \.]+/g, ',' );
        this.elm.tags.val( tag );
        this.last_query.tags = tag;
        var param = $( 'form#flickr' ).formSerialize();
        return param;
    },

    // AJAXリクエスト
    ajax_get_list : function ( param ){
        // 表示初期化
        var tgt = this.elm.page;
        tgt.html( '<img src="img/ajax_load_gray_bgblack.gif"/>' );
        this.elm.page_bottom.empty();
        this.elm.result.empty();
        this.elm.result_misc.empty();
        var cache = this.ajax_cache[ param ];
        if( cache ){
            this.ajax_get_list_onresponse( cache );
        }else{
            // リクエスト先 API URL 生成
            var url = 'http://api.flickr.com/services/rest/'
                + '?format=json&jsoncallback=?&' + param;
            // リクエスト実施
            var _self = this;
            $.getJSON( url, function ( tree ){
                _self.ajax_cache[ param ] = tree; // AJAXキャッシュ
                _self.ajax_get_list_onresponse( tree );
            });
        }
    },

    // AJAXリクエスト - レスポンス処理 
    ajax_get_list_onresponse : function ( tree ){
        var _self = this;
        var res   = tree.photos;
        var tgt   = this.elm.page;
        // エラーチェック
        if( tree.code == 3 ){
            tgt.html( '<span class="page-error">'
                + '該当する写真はありませんでした</span>' )
            return false;
        }else if( tree.stat == 'fail' ){
            tgt.html( '<span class="page-error">'
                + tree.message + '</span>' );
            return false;
        }

        // ページング表示
        var page = new Flickr.UI.Page.Simple( tree );
        page.paginate({
            request: function ( pnum ){
                _self.elm.pnum.val( pnum );
                var param = _self.get_api_param();
                _self.ajax_get_list( param );
            },
            sub_uis: [
                { id: 'flickr-page-bottom' }
            ]
        });

        // 検索結果生成
        this._make_results_list( tree );
    },

    // AJAXリクエスト - 検索結果生成
    _make_results_list : function ( tree ){
        var _self = this;
        var res = tree.photos;
        var start = ( res.page - 1 ) * res.perpage + 1;
        var list = $( '<ol class="img-ol" start="' + start + '"></ol>' );
        $( res.photo ).each( function( i ){
            var li = $( '<li class="img-li" id="li-' + this.id + '"></li>' );
            var href = _self.get_photo_page_url( this );
            var src  = _self.get_photo_src( this, 'm' );
            var link = $( '<div>'
                + '<a href="' + href + '" target="_blank"'
                + ' class="img-link">'
                + '<img src="' + src + '" border="0" alt="' + this.title
                + '"/></a>' + '</div>'
                + '<div class="misc">'
                + '<input type="button" value="選択"/>'
                + '</div>' );
            li.append( link );
            // リストに追加
            list.append( li );
        });
        list.appendTo( this.elm.result );
        
        this.elm.result_misc.html( '検索タグ: ' + this.last_query.tags );
    },

    // Flickr Photo ページへのリンク生成
    get_photo_page_url : function ( itm ){
        var url = 'http://www.flickr.com/photos/' + itm.owner 
            + '/' + itm.id;
        return url;
    },
    // Flickr Photo ファイルへのリンク生成
    get_photo_src : function ( itm, size ){
        if( !size ){ size = 'm' }
        // size について
        // s   small square 75x75
        // t   thumbnail, 100 on longest side
        // m   small, 240 on longest side
        // -   medium, 500 on longest side
        // b   large, 1024 on longest side
        //     (only exists for very large original images)
        // o   original image, either a jpg, gif or png,
        //     depending on source format
        var url = 'http://farm' + itm.farm + '.static.flickr.com/'
            + itm.server + '/' + itm.id + '_' + itm.secret + '_'
            + size + '.jpg';
        return url;
    }
};

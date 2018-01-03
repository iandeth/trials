var MyApp = function (){
    this.init.apply( this, arguments );
};
MyApp.prototype = {

    // コンストラクタ
    init : function ( key ){
        var _self = this;
        this.desc = undefined;     // 詳細表示中のID
        this.key = key;            // API KEY
        this.ajax_hist = {         // AJAXレスポンスキャッシュ
            list : {},
            desc : {}
        };
        this.elm = {               // 各HTMLエレメント
            start        : $( 'form > input[name=start]' ), // hidden input
            list         : $( '#result-list' ),    // 検索結果
            list_page    : {
                top: $( '#rui-page' ),       // ページング
                bottom: $( '#rui-page-bottom' )
            },
            desc         : {      // 詳細表示
                photo: $( '#desc .photo' ),
                info:  $( '#desc .info' )
            }
        };
        // タブUI初期化
        this.tabs = $( '#tab-ul' ).tabs({
            disabled: [ 2, 3 ],
            fxFade: true,
            fxSpeed: 'fast',
            click: function ( clicked, show, hide ){
                var href = $( clicked ).attr( 'href' ).replace( '#', '' );
                _self.tabs._last_href = href;
                // 2つめのタブが押されたら
                if( href == 'list' ){
                    var obj = _self.make_history_hash( 'list' );
                    $.historyLoad( obj.hash, function (){
                        if( _self.tabs._last_href != 'list' ){
                            _self.tabs.tabsClick( 2 );
                            return true;
                        }
                        _self.ajax_get_list( obj.query );
                    });
                // 3つめのタブが押されたら
                }else if( href == 'desc' ){
                    var obj = _self.make_history_hash( 'desc' );
                    $.historyLoad( obj.hash, function (){
                        if( _self.tabs._last_href != 'desc' ){
                            _self.tabs.tabsClick( 3 );
                            return true;
                        }
                    });
                }
            }
        });
        this.tabs._last_href = ''; // history + tabs の回避策
        // Recruit Web Service UI Library
        Recruit.UI.Base.Pulldown.first_opt_text = '－';
        new Beauty.UI.Places.Pulldown();
        new Beauty.UI.HairImage.Pulldown();
        new Beauty.UI.HairLength.Pulldown();
        new Beauty.UI.HairRyou.Pulldown();
        new Beauty.UI.HairShitsu.Pulldown();
        new Beauty.UI.HairFutosa.Pulldown();
        new Beauty.UI.HairKuse.Pulldown();
        new Beauty.UI.HairKaogata.Pulldown();
        new Beauty.UI.Kodawari.Pulldown();
        new Beauty.UI.KodawariSetsubi.Pulldown();
        new Beauty.UI.KodawariMenu.Pulldown();
        new Beauty.UI.Order.Pulldown();

        // フォーム送信時のハンドラ
        var _self = this;
        $( 'form' ).submit( function(){
            _self.elm.start.val( 1 );  // start を初期化
            _self.ajax_hist.list = {}; // cache reset@メモリ節約
            _self.tabs.tabsEnable( 2 );
            _self.tabs.tabsClick( 2 );
            return false;
        });
        // jquery.history.handler
        $.historyInit( function (){
            _self.tabs._last_href = '';
            _self.tabs.tabsClick( 1 );
        });
        // jquery.highlightFade
        $.highlightFade.defaults.speed = 1000;
        // jquery.tooltips
        $.Tooltip.defaults = $.extend( $.Tooltip.defaults, {
            delay      : 1,
            showURL    : false,
            showBody   : " - ",
            track      : true,
            extraClass : "tips",
            left       : -100
        });
    },

    // jquery.history.handler 用 URL HASH 生成
    make_history_hash : function ( type ){
        if( !type ){ return false }
        var obj = { hash: '' };
        // 結果表示の場合
        if( type == 'list' ){
            var start = this.elm.start.val();
            obj.query = $( 'form' ).formSerialize();
            // '%' 文字が location.hash にあると jquery.history
            // が機能しないので、 '[' に一旦置換
            obj.hash = 'list/';
            obj.hash = obj.hash + obj.query.replace( /%/g, '[' );
        // 詳細表示の場合
        }else if( type == 'desc' ){
            obj.query = 'id=' + this.desc;
            obj.hash = 'desc/' + obj.query;
        }
        return obj;
    },

    // AJAXリクエスト - 一覧生成
    ajax_get_list : function ( param ){
        // 表示初期化
        var tgt = this.elm.list_page.top;
        tgt.html( '<img src="img/ajax_load_gray.gif"/>' );
        this.elm.list_page.bottom.empty();
        this.elm.list.empty();
        // AJAXキャッシュある？
        var cache = this.ajax_hist.list[ param ];
        if( cache ){
            this.ajax_get_list_onresponse( cache );
        }else{
            // リクエスト先 API URL 生成
            var url = 'http://webservice.recruit.co.jp/beauty/style/v1/'
                + 'alliance/?format=jsonp&callback=?&key=' + this.key + '&'
                 + param;
            // リクエスト実施
            var _self = this;
            $.getJSON( url, function ( tree ){
                _self.ajax_hist.list[ param ] = tree;   // AJAXキャッシュ
                _self.ajax_get_list_onresponse( tree ); // 結果描画
            });
        }
    },

    // AJAXリクエスト - レスポンス処理 
    ajax_get_list_onresponse : function ( tree ){
        var tgt = this.elm.list;
        // エラーチェック
        var res = tree.results;
        if( res.error ){
            this.elm.list_page.html( '<span class="rui-page-error">'
                + res.error[0].message + '</span>' )
            return false;
        }else if( res.results_returned == 0 ){
            this.elm.list_page.html( '<span class="rui-page-error">'
                + '一致する結果はありませんでした</span>' )
            return false;
        }
        // ページング表示
        var _self = this;
        var c = $( 'form select[name=count]' ).val();
        var page = new Recruit.UI.Page.Simple( tree, c );
        page.paginate({
            id: 'rui-page',
            request: function ( start ){
                _self.elm.start.val( start );
                var obj = _self.make_history_hash( 'list' );
                $.historyLoad( obj.hash, function (){
                    _self.ajax_get_list( obj.query );
                });
            },
            sub_uis: [{ id: 'rui-page-bottom' }]
        });
        // 検索結果生成
        this._make_results_list( tree );
    },

    // AJAXリクエスト - 検索結果生成
    _make_results_list : function ( tree ){
        var _self = this;
        var res = tree.results;
        var list = $( '<ol start="' + res.results_start + '" class="clearfix"></ol>' );
        $( res.style ).each( function( i, r ){
            var text = r.name;
            if( text.length > 25 ){
                text = text.substr( 0, 25 ) + '...';
            }
            if( text == '' ){
                text = 'スタイル名なし';
            }
            var cnt = parseInt( res.results_start ) + i;
            var li = $( '<li></li>' );
            var link = $( '<a href=""></a>' )
            .click( function(){
                _self._set_desc( r );
                var obj = _self.make_history_hash( 'desc' );
                $.historyLoad( obj.hash, function (){
                    _self._create_desc_view( r.id );
                    _self.tabs.tabsEnable( 3 );
                    _self.tabs.tabsClick( 3 );
                });
                return false;
            });
            $( '<img/>' ).attr( 'src', r.photo.front.m )
                .appendTo( link );
            li.append( link );
            list.append( li );
        });
        list.appendTo( this.elm.list );
    },

    // 詳細キャッシュ作成
    _set_desc: function ( obj ){
        this.desc = obj.id;
        this.ajax_hist.desc[ obj.id ] = obj;
    },
    // 詳細キャッシュ取得
    _get_desc: function ( id ){
        if( !id ){
            id = this.desc;
        }
        return this.ajax_hist.desc[ id ] || {};
    },
    
    // 詳細表示
    _create_desc_view: function ( id ){
        var tgt = this.elm.desc;    // 表示対象DIV
        var r   = this._get_desc( id ); // JSON Object
        tgt.photo.empty();
        tgt.info.empty();
        $( '<img />' ).attr( 'src', r.photo.front.l )
            .css( 'margin-bottom', '10px' ).appendTo( tgt.photo );
        if( r.photo.side ){
            tgt.photo.append( '<br/>' );
            $( '<img />' ).attr( 'src', r.photo.side.l )
                .css( 'margin-bottom', '10px' ).appendTo( tgt.photo );
        }
        if( r.photo.back ){
            tgt.photo.append( '<br/>' );
            $( '<img />' ).attr( 'src', r.photo.back.l )
                .css( 'margin-bottom', '10px' ).appendTo( tgt.photo );
        }
        $( '<h2>' + r.name + '</h2>' ).appendTo( tgt.info );
        var s = $( '<p><a href="' + r.urls.pc + 
            '" target="_blank">[ 詳細ページへ ]</a></p>' );
        if( r.pickup == 1 ){
           s.append( '　<span style="color:#FF0000">サロンオススメ！</span>' ); 
        }
        s.appendTo( tgt.info );
        $( '<p>' + r.stylist_comment + '</p>' ).appendTo( tgt.info );
        $( '<p>' + r.style_point + '</p>' ).appendTo( tgt.info );
        $( '<p>' + r.description + '</p>' ).appendTo( tgt.info );
        var hi = [];
        $.each( r.spec.hair_image, function (i,d){
            hi.push( '<span>' + d.name + '</span>' );
        });
        $( '<p>イメージ:　' + hi.join( '、' ) + '</p>' ).appendTo( tgt.info );
        var h = r.spec.hair_length;
        $( '<p>髪の長さ:　<span>' + h.name + '</span></p>' )
            .appendTo( tgt.info );
        h = r.spec.hair_ryou;
        $( '<p>髪の量:　<span>' + h.name + '</span></p>' )
            .appendTo( tgt.info );
        h = r.spec.hair_shitsu;
        $( '<p>髪の質:　<span>' + h.name + '</span></p>' )
            .appendTo( tgt.info );
        h = r.spec.hair_futosa;
        $( '<p>髪の太さ:　<span>' + h.name + '</span></p>' )
            .appendTo( tgt.info );
        h = r.spec.hair_kuse;
        $( '<p>髪のクセ:　<span>' + h.name + '</span></p>' )
            .appendTo( tgt.info );
        h = r.spec.hair_kaogata;
        $( '<p>顔型:　<span>' + h.name + '</span></p>' )
            .appendTo( tgt.info );
        var dt = r.last_update.replace( /[TZ]/g, '　' );
        $( '<p>最終更新日時:　<span>' + dt + '</span>')
            .appendTo( tgt.info );
        $( '<h3>サロン情報</h3>' ).appendTo( tgt.info );
        $( '<p>' + r.salon.name + '　(' + r.salon.name_kana + ')</p>' )
            .appendTo( tgt.info );
        $( '<p>' + r.salon.service_area.name + ' ＞ ' + 
            r.salon.middle_area.name + ' ＞ ' +
            r.salon.small_area.name + '</p>' ).appendTo( tgt.info );
    },

    // 価格をカンマつきに
    _comma: function ( from ){
        from = String( from );
        var to = from;
        var tmp = "";
        while (to != (tmp = to.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))){
            to = tmp;
        }
        return to;
    }
};

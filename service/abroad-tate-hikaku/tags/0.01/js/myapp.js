var MyApp = function (){
    this.init.apply( this, arguments );
};
MyApp.prototype = {

    // コンストラクタ
    init : function (){
        var _self = this;
        this.ids = {};             // 比較候補リスト
        this._id_order_click = 0;  // リスト並び方 追加した順用カウント値
        this.ajax_hist = {         // AJAXレスポンスキャッシュ
            list : {}
        };
        this.elm = {               // 各HTMLエレメント
            start        : $( 'form > input[name=start]' ), // hidden input
            list         : $( '#result-list' ),    // ツアー検索結果
            list_page    : $( '#rui-page' ),       // ページング
            myclip       : $( '#myclip' ),         // my clip
            myclip_btn   : $( '#myclip-btn' ),     // 一覧表で比較ボタン
            compare_tbl  : $( '#compare-table' ),  // 比較テーブル
            sche_tbl     : $( '#sche-table' )      // 調整さん
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
                }else if( href == 'compare' ){
                    // 一覧テーブルを更新
                    var obj = _self.make_history_hash( 'compare' );
                    $.historyLoad( obj.hash, function (){
                        if( _self.tabs._last_href != 'compare' ){
                            _self.tabs.tabsClick( 3 );
                            return true;
                        }
                        _self.update_compare_table();
                    });
                }
            }
        });
        this.tabs._last_href = ''; // history + tabs の回避策
        // APIキーをinputにセット
        $( 'form > input[name=key]' ).val( api_key );
        // フォーム送信時のハンドラ
        var _self = this;
        $( 'form' ).submit( function(){
            _self.elm.start.val( 1 );  // start を初期化
            _self.ajax_hist.list = {}; // cache reset@メモリ節約
            _self.tabs.tabsEnable( 2 );
            _self.tabs.tabsClick( 2 );
            return false;
        });
        // 一覧で比較ボタンのハンドラ
        $( '#myclip-btn > input:first' ).click( function (){
            _self.tabs.tabsEnable( 3 );
            _self.tabs.tabsClick( 3 );
        });
        // マルバツをつけるボタンのハンドラ
        $( '#compare > input[type=button]' ).click( function (){
            _self.make_sche_table();
        });
        // jquery.history.handler
        $.historyInit( function (){
            _self.tabs._last_href = '';
            _self.tabs.tabsClick( 1 );
        });
        // jquery.highlightFade
        $.highlightFade.defaults.speed = 1500;
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
        var obj = { hash : '' };
        // 結果表示の場合
        if( type == 'list' ){
            var start = this.elm.start.val();
            obj.query = 'start=' + start + '&'
                + $( 'form' ).formSerialize();
            // '%' 文字が location.hash にあると jquery.history
            // が機能しないので、 '[' に一旦置換
            obj.hash = 'list/';
            obj.hash = obj.hash + obj.query.replace( /%/g, '[' );
        // 一覧比較の場合
        }else if( type == 'compare' ){
            var arr = [];
            $.each( this.ids, function (){
                arr.push( this.obj.id );
            });
            obj.query = 'id=' + arr.join( ',' );
            obj.hash = 'compare/' + obj.query;
        }
        return obj;
    },

    // AJAXリクエスト - ツアー一覧
    ajax_get_list : function ( param ){
        // 表示初期化
        var tgt = this.elm.list_page;
        tgt.html( '<img src="img/ajax_load_gray.gif"/>' );
        this.elm.list.empty();
        // AJAXキャッシュある？
        var cache = this.ajax_hist.list[ param ];
        if( cache ){
            this.ajax_get_list_onresponse( cache );
        }else{
            // リクエスト先 API URL 生成
            var url = 'http://webservice.recruit.co.jp/ab-road/tour/v1/'
                + '?format=jsonp&callback=?&' + param;
            // リクエスト実施
            var _self = this;
            $.getJSON( url, function ( tree ){
                _self.ajax_hist.list[ param ] = tree;   // AJAXキャッシュ
                _self.ajax_get_list_onresponse( tree ); // 結果描画
            });
        }
    },

    // AJAXリクエスト - ツアー一覧  - レスポンス処理 
    ajax_get_list_onresponse : function ( tree ){
        var tgt = this.elm.list;
        // エラーチェック
        var res = tree.results;
        if( res.error ){
            tgt.html( '<span class="rui-page-error">'
                + res.error[0].message + '</span>' )
            return false;
        }else if( res.results_returned == 0 ){
            tgt.html( '<span class="rui-page-error">'
                + '一致するツアーはありませんでした</span>' )
            return false;
        }
        // ページング表示
        var _self = this;
        var c = $( 'form > input[name=count]' ).val();
        var page = new Recruit.UI.Page.Simple( tree, c );
        page.paginate({
            id: 'rui-page',
            request: function ( start ){
                _self.elm.start.val( start );
                var obj = _self.make_history_hash( 'list' );
                $.historyLoad( obj.hash, function (){
                    _self.ajax_get_list( obj.query );
                });
            }
        });
        // 検索結果生成
        this._make_results_list( tree );
    },

    // AJAXリクエスト - ツアー一覧 - 検索結果生成
    _make_results_list : function ( tree ){
        var _self = this;
        var res = tree.results;
        var list = $( '<ol start="' + res.results_start + '"></ol>' );
        $( res.tour ).each( function( i ){
            var text = _self._comma( this.price.min ) + '円～ ' + this.title;
            text = text.substr( 0, 25 );
            var cnt = parseInt( res.results_start ) + i;
            var li = $( '<li class="bm" id="li-' + this.id + '"></li>' );
            var _data = this;
            // 各行のコンテンツ
            var inp = $( '<input type="checkbox"/> ' )
                .click( function (){
                    if( $( this ).attr('checked') ){
                        _self.change_id_list( 'add', _data, cnt );
                    }else{
                        _self.change_id_list( 'remove', _data, cnt );
                    }
                    _self.update_list_check(); // チェック状態更新
                });
            li.append( inp );
            li.append( '&nbsp;&nbsp;' );
            var link = $( '<a href="' + this.urls.pc
                + '">' + text + '...</a>' );
            li.append( link );
            // リストに追加
            list.append( li );
        });
        list.appendTo( this.elm.list );
        this.update_list_check(); // チェック状態を更新
    },

    // ツアー一覧のチェック状態を更新
    update_list_check : function (){
        var _self = this;
        $.each( this.elm.list.find( 'li' ), function (){
            var li = $( this );
            var _tmp = li.attr( 'id' ).split( '-' );
            var id = _tmp[1];
            if( _self.ids[ id ] ){
                li.find( 'input[type=checkbox]' )
                    .attr( 'checked', 'checked' );
                li.find( 'a' ).addClass( 'check-on' );
            }else{
                li.find( 'input[type=checkbox]' )
                    .attr( 'checked', '' );
                li.find( 'a' ).removeClass( 'check-on' );
            }
        });
    },

    // this.ids リストの編集
    change_id_list : function ( type, obj, order_list ){
        if( type == 'add' ){
            this._id_order_click += 1;
            this.ids[ obj.id ] = {
                'order' : {
                    click : this._id_order_click,
                    list  : order_list || 0
                },
                'obj' : obj
            };
            this.update_myclip( 'add' ); // 表示更新
        }else if( type == 'remove' ){
            delete this.ids[ obj.id ];
            this.update_myclip( 'remove' ); // 表示更新
        }
        return false; 
    },

    // my clip 一覧表示を更新
    update_myclip : function ( type ){
        var tgt = this.elm.myclip;
        tgt.empty();
        var list = $( '<ol></ol>' );
        var _self = this;
        $.each( this.ids, function (){
            var obj = this.obj;
            var text = _self._comma( obj.price.min ) + '円～ ' + obj.title;
            text = text.substr( 0, 25 );
            $( '<li>' + text + '...&nbsp;&nbsp;'
                + '<a class="desc" href="' + obj.urls.pc + '">'
                + '[詳細]</a>&nbsp;&nbsp;'
                + '<a class="remove" href="#">[ｘ]</a>'
                + '</li>' )
                .find( 'a.remove' )
                .click( function (){
                    _self.change_id_list( 'remove', obj );
                    _self.update_list_check();
                    return false;
                })
                .end()
                .appendTo( list );
        });
        tgt.append( list );
        if( type == 'add' ){
            list.find( 'li:last' ).highlightFade( 'yellow' );
        }
        // 比較ボタンの表示
        var i=0;
        $.each( this.ids, function (){ i++ } );
        if( i > 0 ){
            this.elm.myclip_btn.css( 'display', 'block' );            
        }else{
            this.elm.myclip_btn.css( 'display', 'none' );            
        }
    },

    // 一覧テーブルを更新
    update_compare_table : function (){
        var tgt  = this.elm.compare_tbl;
        tgt.empty();
        // 表項目を定義
        var cols = this.get_compare_table_defs();
        $.each( cols, function ( i ){
            this.dom = $( '<tr><td class="label">' + this.lbl
                + '</td></tr>' );
            if( i % 2 ){
                this.dom.find( 'td:first' ).addClass( 'even' );
            }
            tgt.append( this.dom );
        });
        // 表作成
        var i=1;
        $.each( this.ids, function ( k, itm ){
            $.each ( cols, function ( j, def ){
                var td= $( '<td class="desc"></td>' );
                if( j % 2 ){
                    td.addClass( 'even' );
                }
                td.append( def.val( itm.obj, i ) );
                def.dom.append( td ); 
            });
            i++;
        });
    },

    // 一覧テーブル定義
    get_compare_table_defs : function (){
        var _self = this;
        var cols = [
            { lbl: '連番', val: function (t,i){
                 return i + '.';
            }},
            { lbl: 'タイトル', val: function (h){
                t = h.title.substr( 0, 25 ) + '...';
                return t;
            }},
            { lbl: '期間', val: function (h){ return h.term + ' 日間' } },
            { lbl: '価格', val: function (h){
                var t = _self._comma( h.price.min )
                    + '円 ～<br />' + _self._comma( h.price.max )
                    + '円';
                return t;
            }},
            { lbl: '訪問都市', val: function (h){
                var t = h.city_summary;
                t = t.replace( /、/g, '<br />' );
                return t;
            }},
            { lbl: '出発地', val: function (h){ return h.dept_city.name } },
            { lbl: '航空会社', val: function (h){
                var flag = 0;
                $.each( h.kodawari, function (){
                    if( this.code == '8' ){
                        flag += 1;
                        return false;
                    }
                });
                // 航空会社指定なら
                if( flag ){
                    var t = h.airline_summary;
                    t = t.replace( /、/g, '、<br />' );
                    return t;
                }else{
                    var t = $( '<span class="tip-text" title="'
                        + h.airline_summary + '">これらのいずれか</span>' )
                        .Tooltip();
                    return t;
                }
            }},
            { lbl: 'ホテル', val: function (h){
                var flag = 0;
                $.each( h.kodawari, function (){
                    if( this.code == '9' ){
                        flag += 1;
                        return false;
                    }
                });
                // ホテル指定なら
                if( flag ){
                    var t = h.hotel_summary;
                    t = t.replace( /、/g, '、<br />' );
                    return t;
                }else{
                    var t = $( '<span class="tip-text" title="'
                        + h.hotel_summary + '">これらのいずれか</span>' )
                        .Tooltip();
                    return t;
                }
            }},
            { lbl: 'こだわり', val: function (h){
                var t = '';
                $.each( h.kodawari, function (){
                    t += this.name + '<br />';
                });
                return t;
            }},
            { lbl: 'ブランド', val: function (h){ return h.brand.name } },
            { lbl: '', val: function (h){
                var t = '<a href="' + h.urls.pc
                    + '" target="_blank">[詳細]</a>';
                return t;
            }},
            { lbl: '', val: function (h){
                var a = $( '<a href="">[削除]</a>' ).click( function (){
                    _self.change_id_list( 'remove', h );
                    _self.update_compare_table();
                    return false;
                });
                return a;
            }},
            { lbl: '<img src="img/dot.gif" class="spacer-label"/>',
              val: function (t,i){
                return '<img src="img/dot.gif" class="spacer"/>';
            }}
        ];
        return cols;
    },

    // 調整さん部分作成
    make_sche_table : function (){
        var _self = this;
        var tgt = this.elm.sche_tbl;
        tgt.empty();
        var p = [
            { name: '石橋' },
            { name: '子安' },
            { name: '渡邊' },
            { name: '西川' }
        ];
        $.each( p, function ( i, itm ){
            var tr = $( '<tr></tr>' ).appendTo( tgt );
            tr.append( '<td class="label">' + itm.name + '</td>' );
            $.each( _self.ids, function (){
                var i = parseInt( Math.random( 10 ) * 10 );
                var mb = $( '<span>×</span>' );
                if( i >= 0 && i < 3 ){
                    mb = $( '<span>○</span>' );
                }else if( i >= 3 && i < 6 ){
                    mb = $( '<span>△</span>' );
                }
                var td = $( '<td class="desc"></td>' );
                td.append( mb );

                i = parseInt( Math.random( 10 ) * 10 );
                if( i >= 0 && i < 2 ){
                    td.append( '&nbsp;' );
                    var memo = $( '<span class="tip-text"'
                        + 'title="これいいかも。メモです">'
                        + 'memo' + '</span>' )
                        .css( 'font-size', '0.7em' );
                    memo.Tooltip();
                    td.append( memo );
                }
                tr.append( td );
            });
        });

        var tr = $( '<tr></tr>' ).appendTo( tgt );
        tr.append( '<td class="label">'
            + '<img src="img/dot.gif" class="spacer-label"/></td>' );
        $.each( _self.ids, function (){
            tr.append( '<td class="desc">'
                + '<img src="img/dot.gif" class="spacer"/></td>' );
        });
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

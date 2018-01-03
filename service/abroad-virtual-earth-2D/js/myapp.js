(function($){

MyApp = function() {
    this.constructor.apply( this, arguments );
};
MyApp.prototype = {
    constructor: function ( hash ){
        $.extend( this, {
            _height: {
                navi: 0,
                map:  0
            },
            elm: {
                vearth:   $( '#vearth' ),
                navi:     $( 'div.navi >> .cont' ),
                tab_ctrl: undefined,
                step1:    $( '#step1' ),
                step2:    $( '#step2' ),
                step3:    $( '#step3' ),
                step4:    $( '#step4' ),
                step5:    $( '#step5' ),
                options:  $( '#options' ),
                options_tour: $( '#options-tour' )
            },
            ajax: {
                load_gif: 'img/ajax_load_gray.gif',
                city_search: {
                    query: '',
                    type:  '',
                    title: '',
                    page: undefined
                },
                spot_search: {
                    query: '',
                    city: {},
                    is_new: true
                },
                tour_search: {
                    city: {},
                    query: '',
                    result: {},
                    page: undefined
                }
            },
            api: {
                base_url: 'http://webservice.recruit.co.jp/ab-road',
                //base_url: 'http://192.168.0.248/ab-road',
                key: hash.key || '',
                count: {
                    city_search: 10,
                    tour_search: 10
                }
            },
            vearth: undefined
        });
        var _inst = this;
        // initialize history plugin
        $.historyInit( function (){
            _inst.change_tab( 'step1' );
        });
        // resize navigation content
        this.resize_navi_height();
        $( window ).resize( function (){
            _inst.resize_navi_height();
        });
        // init tab ui 
        this.elm.tab_ctrl = $( '#tabs' ).tabs({
            fxAutoHeight: false,
            fxFade: true,
            bookmarkable: false,
            onHide: function ( tgt ){
                var id = $( tgt ).attr( 'href' ).replace( /^.*#/, '' );
                _inst._update_global_navi( id );
            },
            onShow: function ( tgt ){
                _inst.elm.navi.height( _inst._height.navi );    
            }
        });
        // step1 - init global navi
        this._update_global_navi( 'step1' );
        // step1 - search option tab
        $( '#step1' ).find( '.back > a' ).click( function (){
            $.historyLoad( 'options', function (){
                _inst.change_tab( 'options' );
            });
            return false;
        });
        new ABROAD.UI.Dept.Pulldown().init();
        // step1 - city search handler
        $( '#form_city' ).submit( function (){
            $.historyLoad( 'step2_page1', function (){
                if( _inst.vearth ){
                    _inst.vearth.show_controls();
                }
                _inst.city_search( 1, 'keyword' );
            });
            return false;
        });
        // step1 - places drilldown ui
        new ABROAD.UI.Places.Drilldown({
            with_tour_count: true,
            fx_speed: 'normal',
            click_effects_post_hook: function (){
                document.location = '#area';
            },
            country_click: function ( itm ){
                $.historyLoad( 'step2_page1', function (){
                    if( _inst.vearth ){
                        _inst.vearth.show_controls();
                    }
                    _inst.city_search( 1, 'places', itm );
                });
                return false;
            }
        }).init();
        // step1 - keyword tag crowd
        this._create_keycrowd( $( '#step1' ).find( '.keycrowd:first' ) );
        // step2 - back to city search link
        $( '#step2' ).find( '.to_step1 > a:first' ).click( function (){
            $.historyLoad( 'step1', function (){
                _inst.change_tab( 'step1' );
            });
            return false;
        });
        // step3 - search option tab
        $( '#step3' ).find( '.to_option >> a:first' ).click( function (){
            $.historyLoad( 'options-tour', function (){
                _inst.change_tab( 'options-tour' );
            });
            return false;
        });
        new ABROAD.UI.Dept.Pulldown().init();
        // step3 - back to city search link
        $( '#step3' ).find( '.to_step2 > a:first' ).click( function (){
            var p = (_inst.ajax.city_search.page)?
                _inst.ajax.city_search.page.current_page() : 1;
            $.historyLoad( 'step2_page' + p );
            return false;
        });
        // step4 - back to city desc link
        $( '#step4' ).find( '.to_step3 > a:first' ).click( function (){
            var code = (_inst.ajax.spot_search.city)?
                _inst.ajax.spot_search.city.code : '';
            $.historyLoad( 'step3_' + code );
            return false;
        });
        // step5 - back to tour list link
        $( '#step5' ).find( '.to_step4 > a:first' ).click( function (){
            var p = (_inst.ajax.tour_search.page)?
                _inst.ajax.tour_search.page.current_page() : 1;
            $.historyLoad( 'step4_page' + p );
            return false;
        });
        // options - on close hanlder
        $( '#form_options' ).submit( function (){
            $.historyLoad( 'step1', function (){
                _inst.change_tab( 'step1' );
            });
            return false;
        });
        // options - set api_key to hidden input
        $( '#form_options > input[@name=key]' ).val( this.api.key );
        // options-tour - on close hanlder
        $( '#form_options_tour' ).submit( function (){
            var p = (_inst.ajax.spot_search.city)?
                _inst.ajax.spot_search.city.code : '';
            $.historyLoad( 'step3_' + p );
            return false;
        });
        // 地球の操作方法
        $('#ft').find( '.tips:first' )
                .attr( 'title', 
                    '地球を１度クリックした状態で...'
                    + ' - '
                    + '<ul>'
                    + '<li>"＋"キー : ズームイン</li>'
                    + '<li>"ー"キー : ズームアウト</li>'
                    + '<li>前後左右矢印キー : 位置移動</li>'
                    + '<li>Ctrl + 左右矢印キー : 方向転換</li>'
                    + '<li>Ctrl + 上下矢印キー : 視点角度変更</li>'
                    + '</ul>'
                )
                .Tooltip({
                    delay:1, showURL:false,
                    showBody:" - ", track:true, extraClass:"tips",
                    left: -200
                });
    },
    city_search: function ( start, type, itm ){
        // earth上の噴出し位置再計算のため。仕方なく
        if( this.vearth ){
            var cont = $( '#bd .map > .cont' );
            this.vearth.map.Resize( cont.width(), cont.height() );
        }
        // show ajax load gif
        this.elm.step2.find( '.result' ).hide();
        this.elm.step2.find( '.loading' ).fadeIn( 'normal' );
        this.change_tab( 'step2' );
        // make query
        var query = '';
        if( type == 'places' ){
            // search from places drilldown
            //query = 'keyword=' + encodeURIComponent( itm.name )
            //    + ',' + itm.code;
            query = 'keyword=' + encodeURIComponent( itm.name );
            query += '&' + $( '#form_options' ).formSerialize();
            this.ajax.city_search.title = itm.name;
        }else if( type == 'keyword' ){
            // search from freeword text
            query = $( '#form_city' ).formSerialize();
            query += '&' + $( '#form_options' ).formSerialize();
            this.ajax.city_search.title = $( '#form_city' )
                .find( 'input[@name=keyword]' ).val();
        }else if( type == 'keycrowd' ){
            // search from keyword tag-crowd
            query = $( '#form_city' ).formSerialize();
            query = query.replace( /keyword=[^&]*(&)?/, '' );
            query += '&keyword=' + encodeURIComponent( itm.name );
            query += '&' + $( '#form_options' ).formSerialize();
            this.ajax.city_search.title = itm.name;
        }else{
            // if type not defined, use previous query
            query = this.ajax.city_search.query;
        }
        // get and update count param
        this.api.count.city_search = $( '#form_options' )
            .find( 'select[@name=count]').val();
        // save ajax related info to instance property
        this.ajax.city_search.query = query;
        if( type ){
            this.ajax.city_search.type = type;
        }
        // make full uri
        var uri = this.api.base_url + '/tour_tally/v1/?' + query
            + '&start=' + start
            + '&format=jsonp&callback={callback}';
        $.log( 'city_search: ' + uri );
        // JSONP request
        var _inst = this;
        $.getJSONP( uri, function ( json ){
            _inst.city_search_on_complete( json );
        });
    },
    city_search_on_complete: function ( json ){
        var _inst = this;
        var res = json.results;
        var tgt = this.elm.step2;
        // view initialize & set header 
        var h2 = tgt.find( 'h2:first' ).html( this.ajax.city_search.title );
        var h3 = tgt.find( 'h3:first' ).empty();
        var pager_left = tgt.find( '.yui-u.first' ).empty();
        var res_list  = tgt.find( '.result-list' ).empty();
        var note = tgt.find( '.note' ).hide();
        // error handling
        var is_error = 0;
        if( res.error ){
            h2.html( 'エラー' );
            h3.html( res.error[0].message );
            is_error = 1;
        }else if( res.results_returned == "0" ){
            h3.html( '該当する都市はありませんでした' );
            is_error = 1;
        }
        if( is_error ){
            tgt.find( '.loading' ).hide();
            tgt.find( '.result' ).fadeIn( 'normal' );
            return false;
        }
        // paginate
        var page = new ABROAD.UI.Page( json, this.api.count.city_search );
        this.ajax.city_search.page = page;
        h3.html( 'といえばこれら <span style="font-size:130%">'
            + page.total_entries() + '</span> 都市がオススメです' );
        if( page.previous_page() ){
            var prevpp = page.previous_page_param();
            $( '<a href="#" style="font-weight:bold">&lt;前へ</a>' )
                .click( function(){
                    $.historyLoad( 'step2_page' + page.previous_page(),
                        function (){
                            _inst.city_search( prevpp.start );
                        });
                    return false;
                })
                .appendTo( pager_left );
                pager_left.append( '<span>&nbsp;&nbsp;</span>' );
        }
        pager_left.append(  + page.current_page() + ' / '
            + page.last_page() + ' ページ' );
        if( page.next_page() ){
            pager_left.append( '<span>&nbsp;&nbsp;</span>' );
            var nextpp = page.next_page_param();
            $( '<a href="#" style="font-weight:bold">次へ&gt;</a>' )
                .click( function(){
                    $.historyLoad( 'step2_page' + page.next_page(),
                        function (){
                            _inst.city_search( nextpp.start );
                        });
                    return false;
                })
                .appendTo( pager_left );
        }
        // result list
        var i = res.results_start;
        $( res.tour_tally ).each( function(){
            var itm = this;
            var el = $( '<li><span class="seq">' + i + '.</span> '
                + '<a href="#" id="li_city_' + itm.code  + '">' + itm.name
                + '&nbsp;<span style="font-size:65%">['
                + itm.tour_count + ']' + '</span></a></li>' );
            var ahref = el.find( 'a:first' );
            ahref.click( function (){
                _inst.ajax.spot_search.is_new = true;
                $.historyLoad( 'step3_' + itm.code, function (){
                    _inst.spot_search( itm );
                });
                return false;
            })
            if( !itm.lat ){
                ahref.attr( 'title', '緯度経度 不明...' )
                    .Tooltip({ delay:1, showURL:false, track:true, top:0 });
            }
            if( itm.lat && _inst.vearth ){
                ahref.hover( function (){
                    _inst.vearth.focus_city( itm );
                    _inst.vearth._hilight_city( itm.code );
                }, function (){
                    _inst.vearth._hilight_city( itm.code, 1 );
                });
            }
            el.appendTo( res_list );
            i++;
        });
        res_list.find( 'li:even' ).addClass( 'stripe' );
        // show content
        note.show();
        tgt.find( '.loading' ).hide();
        tgt.find( '.result' ).fadeIn( 'normal' );
        // virtual earth - plot cities
        var ve = this.vearth;
        if( ve ){
            ve.map.SetMapStyle( VEMapStyle.Hybrid );
            ve.clear_cities();
            ve.clear_spots();
            ve.plot_cities( res.tour_tally );
            //ve.focus_city( res.tour_tally[0] );
        }
    },
    spot_search: function ( city ){
        // show ajax load gif
        this.elm.step3.find( '.result' ).hide();
        this.elm.step3.find( '.loading' ).fadeIn( 'normal' );
        this.change_tab( 'step3' );
        // make query
        var query = 'key=' + this.api.key + '&city=' + city.code;
        // save ajax related info to instance property
        this.ajax.spot_search.query = query;
        this.ajax.spot_search.city  = city;
        // make full uri
        var uri = this.api.base_url + '/spot/v1/alliance/?' + query
            + '&count=100'
            + '&format=jsonp&callback={callback}';
        $.log( 'spot_search: ' + uri );
        // JSONP request
        var _inst = this;
        $.getJSONP( uri, function ( json ){
            _inst.spot_search_on_complete( json );
        });
    },
    spot_search_on_complete: function ( json ){
        var _inst = this;
        var res = json.results;
        var tgt = this.elm.step3;
        // view initialize & set header 
        tgt.find( '.subtitle:first' ).remove();
        var h2 = tgt.find( 'h2:first' ).html(
            this.ajax.spot_search.city.name );
        h2.before( '<div class="subtitle">' + this.ajax.city_search.title
            + '</div>' );
        var h3 = tgt.find( 'h3:first' ).html('はこんな素敵な都市です');
        var res_list = tgt.find( '.result-list' ).empty();
        var defmap = tgt.find( '.defmap:first' ).show();
        // error handling
        var is_error = 0;
        if( res.error ){
            res_list.html( '<li>エラー: ' + res.error[0].message
                + '</li>' );
        }else if( res.results_returned == 0 ){
            res_list.html( '<li style="font-size:80%;color:#999">'
                + '観光地は探せませんでした</li>' );
            defmap.hide();
        }
        // result list
        var i = res.results_start;
        $( res.spot ).each( function(){
            var itm = this;
            var html = '<a href="#">' + itm.name + '</a><br />'
                + '<span style="font-size:80%;color:#666">'
                + itm.title + '</span>';
            var li = $( '<li><span class="seq">' + i + '.</span> '
                + html + '</li>' );
            if( itm.lat && _inst.vearth ){
                li.find( 'a:first' ).hover( function (){
                    ve.focus_spot( itm, null );
                    _inst.vearth._hilight_spot( itm.code );
                }, function (){
                    _inst.vearth._hilight_spot( itm.code, 1 );
                }).click( function (){
                    var shape = _inst.vearth.spots[ itm.code ].shape;
                    if( shape ){
                        _inst.vearth.map.ShowInfoBox( shape );
                    }
                    return false;
                });
            }
            li.appendTo( res_list );
            i++;
        });
        res_list.find( 'li:odd' ).addClass( 'stripe' );
        // show content
        tgt.find( '.loading' ).hide();
        tgt.find( '.result' ).fadeIn( 'normal' );
        tgt.find( 'a.to_step4:first' )
            .html( this.ajax.spot_search.city.name
                + 'を訪れるツアーを一覧表示' )
            .unbind( 'click' )
            .click( function (){
                $.historyLoad( 'step4_page1', function (){
                    _inst.tour_search( 1, _inst.ajax.spot_search.city );
                });
                return false;
            });
        defmap.find( 'a:first' ).click( function (){
            var ve = _inst.vearth;
            if( ve ){
                _inst.vearth.focus_spots( _inst.ajax.spot_search.city );
            }
            return false;
        });
        // virtual earth - plot spots
        var ve = this.vearth;
        if( ve ){
            if( this.ajax.spot_search.is_new &&
                this.ajax.spot_search.city.lat ){
                this.ajax.spot_search.is_new = false;
                ve.map.SetMapStyle( VEMapStyle.Hybrid );
                ve.clear_spots();
                ve.plot_spots( this.ajax.spot_search.city, res.spot );
            }
        }
    },
    tour_search: function ( start, city ){
        // get current city data ( for 1< page request )
        if( !city ){
            city = this.ajax.tour_search.city;
        }
        // show ajax load gif
        this.elm.step4.find( '.result' ).hide();
        this.elm.step4.find( '.loading' ).fadeIn( 'normal' );
        this.change_tab( 'step4' );
        // make query 
        var query = this.ajax.city_search.query + '&city='
            + city.code;
        // delete unwanted params (count/order)
        query = query.replace( /(count|order)=[^&]*(&)?/g, '' );
        // join tour search options
        query += '&' + $( '#form_options_tour' ).formSerialize();
        // get and update count param
        this.api.count.tour_search = $( '#form_options_tour' )
            .find( 'select[@name=count]').val();
        // save ajax related info to instance property
        this.ajax.tour_search.query = query;
        this.ajax.tour_search.city  = city;
        // make full uri
        var uri = this.api.base_url + '/tour/v1/?' + query
            + '&start=' + start
            + '&format=jsonp&callback={callback}';
        $.log( 'tour_search: ' + uri );
        // JSONP request
        var _inst = this;
        $.getJSONP( uri, function ( json ){
            _inst.tour_search_on_complete( json );
        });
    },
    tour_search_on_complete: function ( json ){
        var _inst = this;
        var res = json.results;
        var tgt = this.elm.step4;
        var note = tgt.find( '.note' ).hide();
        // view initialize & set header 
        tgt.find( '.subtitle:first' ).remove();
        var h2 = tgt.find( 'h2:first' ).html(
            this.ajax.tour_search.city.name );
        h2.before( '<div class="subtitle">' + this.ajax.city_search.title
            + '</div>' );
        var h3 = tgt.find( 'h3:first' ).empty();
        var pager_left = tgt.find( '.yui-u.first' ).empty();
        var res_list  = tgt.find( '.result-list' ).empty();
        // error handling
        var is_error = 0;
        if( res.error ){
            h2.html( 'エラー' );
            h3.html( res.error[0].message );
            is_error = 1;
        }else if( res.results_returned == 0 ){
            h3.html( '該当するツアーはありませんでした' );
            is_error = 1;
        }
        if( is_error ){
            tgt.find( '.loading' ).hide();
            tgt.find( '.result' ).fadeIn( 'normal' );
            return false;
        }
        // paginate
        var page = new ABROAD.UI.Page( json, this.api.count.tour_search );
        this.ajax.tour_search.page = page;
        h3.html( '<span style="font-size:130%">'
            + page.total_entries() + '</span> 件のツアーが見つかりました' );
        if( page.previous_page() ){
            var prevpp = page.previous_page_param();
            $( '<a href="#" style="font-weight:bold">&lt;前へ</a>' )
                .attr( 'href', '#step4_prevp' )
                .click( function(){
                    $.historyLoad( 'step4_page' + page.previous_page(),
                        function (){
                            _inst.tour_search( prevpp.start );
                        });
                    return false;
                })
                .appendTo( pager_left );
                pager_left.append( '<span>&nbsp;&nbsp;</span>' );
        }
        pager_left.append(  + page.current_page() + ' / '
            + page.last_page() + ' ページ' );
        if( page.next_page() ){
            pager_left.append( '<span>&nbsp;&nbsp;</span>' );
            var nextpp = page.next_page_param();
            $( '<a href="#" style="font-weight:bold">次へ&gt;</a>' )
                .attr( 'href', '#step4_nextp' )
                .click( function(){
                    $.historyLoad( 'step4_page' + page.next_page(),
                        function (){
                            _inst.tour_search( nextpp.start );
                        });
                    return false;
                })
                .appendTo( pager_left );
        }
        // result list
        var i = res.results_start;
        $( res.tour ).each( function(){
            var itm = this;
            var html = _inst.create_tour_li( itm );
            $( '<li><span class="seq">' + i + '.</span> '
                + html + '</li>' )
                .find( 'a:first' ).click( function (){
                    $.historyLoad( 'step5_' + itm.id, function (){
                        _inst.show_tour_desc( itm );
                    });
                    return false;
                }).end()
                .appendTo( res_list );
            i++;
        });
        res_list.find( 'li:even' ).addClass( 'stripe' );
        // store result object in intance property for later use
        this.ajax.tour_search.result = res;
        // show content
        note.show();
        tgt.find( '.loading' ).hide();
        tgt.find( '.result' ).fadeIn( 'normal' );
        // virtual earth
        var ve = this.vearth;
        if( ve ){
            ve.hide_route();
        }
    },
    create_tour_li: function ( tour ){
        var s = '<a href="#">';
        s += this._to_comma_int( tour.price.min )
            + '円～ ';
        s += tour.term + '日間 - ';
        s += tour.dept_city.name + '発</a><br />';
        s += '<span style="font-size:80%;color:#666">';
        s += this._truncate_str( tour.airline_summary ) + ' | ';
        s += this._truncate_str( tour.hotel_summary );
        if( tour.city_summary.match( '、' ) ){
            s += '<br />[周遊] ' + tour.city_summary + '<br />';
        }
        s += '</span>';
        return s;
    },
    show_tour_desc: function ( tour ){
        var _inst = this;
        var tgt = this.elm.step5;
        var note = tgt.find( '.note' );
        // view initialize & set header 
        tgt.find( '.subtitle:first' ).remove();
        var h2 = tgt.find( 'h2:first' );
        h2.html( this._to_comma_int( tour.price.min ) + '円～ '
            + tour.term + '日間 - ' + tour.dept_city.name + '発</a><br />' );
        h2.before( '<div class="subtitle">' + this.ajax.city_search.title
            + ' &gt; ' + this.ajax.tour_search.city.name
            + '</div>' );
        var h3 = tgt.find( 'h3:first' ).empty();
        var pager_left = tgt.find( '.yui-u.first' ).empty();
        var desc = tgt.find( '#tour-desc' ).empty();
        // display description
        h3.html( tour.title );
        var sche = [];
        $.each( tour.sche, function (){
            var city = this.city;
            var name = ( city.name )? city.name : '-';
            var elm;
            if( city.code && city.code.match( /^[A-Z]/ ) ){
                elm = $( '<li>' + this.day + '日目: ' 
                    + '<a href="#" style="color:#000">' + name + '</a></li>' )
                    .find( 'a:first' ).click( function (){
                        _inst.ajax.spot_search.is_new = true; 
                        $.historyLoad( 'step3_' + city.code, function (){
                            _inst.spot_search( city );
                        });
                        return false;
                    }).end();
            }else{
                elm = $( '<li>' + this.day + '日目: ' + name + '</li>' );
            }
            sche.push( elm );
        });
        var ve = this.vearth;
        $( '<h4 style="margin-top:5px">スケジュール</h4>'
            + '<p class="out-link" style="text-align:left">'
            + '<a class="show_route" href="#">[地図にルートを表示]</a></p>' )
            .find( 'a.show_route:first' ).click( function(){
                ve.travel_path( tour );
                return false;
            }).appendTo( desc );
        var ol = $( '<ol class="result-list" style="margin: 10px 20px"></ol>' );
        $.each( sche, function (){
            ol.append( this );
        });
        ol.find( 'li:even' ).addClass( 'stripe' );
        ol.appendTo( desc );
        $( '<p class="out-link"><a href="'
            + tour.urls.pc + '#tour-schedule" target="_blank">'
            + '* スケジュール詳細はこちら</a></p>' )
            .appendTo( desc );
        // kodawari
        var koda = [];
        $.each( tour.kodawari, function (){
            koda.push( this.name );
        });
        desc.append( '<h4>特徴</h4><p>' + koda.join('、') + '</p>' );
        // airlines
        desc.append( '<h4 style="margin-top:0">利用航空会社</h4>'
            + '<p>' + tour.airline_summary.replace( /、/g, '<br />' )
            + '</p>' );
        desc.append( '<h4>滞在ホテル</h4>'
            + '<p>' + tour.hotel_summary.replace( /、/g, '<br />' )
            + '</p>' );
        desc.append( '<h4>価格帯</h4>'
            + '<p style="margin-bottom:10px">'
            + this._to_comma_int( tour.price.min )
            + '円 ～ ' + this._to_comma_int( tour.price.max )
            + '円</p>'
            + '<p class="out-link"><a href="'
            + tour.urls.pc + '#cal" target="_blank">'
            + '* 価格カレンダーはこちら</a></p>'
        );
        desc.append( '<h4>ブランド</h4><p>' + tour.brand.name + '</p>' );
        var arr = tour.last_update.match(
            /(\d{4})-(\d{2})-(\d{2})T(\d{2}:\d{2})/ );
        var upd = arr[1] + '/' + arr[2] + '/' + arr[3] + ' ' + arr[4];
        desc.append( '<h4>情報更新日</h4><p>' + upd + '</p>' );
        desc.append( '<h4>詳細</h4><p><a href="'
            + tour.urls.pc + '" target="_blank">'
            + 'ツアーのより詳細な情報はこちら</a></p>' );
        // show content
        note.show();
        this.change_tab( 'step5' );
    },
    change_tab: function ( id ){
        var tgt = $( '#' + id );
        if( !tgt.length ){ return undefined }
        this.elm.tab_ctrl.triggerTab( id );
        var ve = this.vearth;
        if( ve ){
            if( id == 'step1' ){
                ve.init( 5000 );
            }else if( id == 'step2' ){ 
                ve.clear_spots();
                ve.init_zoom();
            }
        }
    },
    _update_global_navi: function ( id ){
        var tgt = $( '.navi .head:first' ).empty();
        var defs = [
            { id:"step1", label:"キーワード" },
            { id:"step2", label:"都市一覧" },
            { id:"step3", label:"都市詳細" },
            { id:"step4", label:"ツアー一覧" },
            { id:"step5", label:"ツアー詳細" }
        ];
        var hit = 0;
        var _inst = this;
        $.each( defs, function (i){
            var p = defs[i];
            if( p.id == id ){
                tgt.append( '<span>' + p.label + '</span>' )
                    .find( 'span:first' ).css({
                        'font-weight':"bold", 'color':"#FFF" });
                hit++;
            }else{
                if( hit ){
                    tgt.append( p.label );
                }else{
                    $( '<a href="#">' + p.label + '</a>' )
                        .click( function (){
                            var hash = defs[i].id;
                            if( hash == 'step2' ){
                                var p = (_inst.ajax.city_search.page)?
                                    _inst.ajax.city_search.page.current_page()
                                    : 1;
                                hash += '_page' + p;
                            }
                            if( hash == 'step3' ){
                                var p = (_inst.ajax.spot_search.city)?
                                    _inst.ajax.spot_search.city.code
                                    : '';
                                hash += '_' + p;
                            }
                            if( hash == 'step4' ){
                                var p = (_inst.ajax.tour_search.page)?
                                    _inst.ajax.tour_search.page.current_page()
                                    : 1;
                                hash += '_page' + p;
                            }
                            $.log( 'global_navi: ' +  hash );
                            $.historyLoad( hash );
                            return false;
                        }).appendTo( tgt );
                }
            }
            if( i + 1 != defs.length ){
                tgt.append( '&nbsp;&gt;&nbsp;' );
            }
        });
        if( hit == 0 ){
            tgt.html( '<span>オプション</span>' );
        }
    },
    resize_navi_height: function (){
        var h = {
            doc : 0,
            hd  : 2,            // top + bottom border
            ft  : 2,            // top + bottom border
            navi_head : 5 + 5,  // add top + bottom padding
            navi_pads : 5 * 5,  // white layout margin 
            map_pads  : 5 * 4,  // white layout margin
            navi_unknown : 32,  // for div with scrollbars (?)
            trivials : 2        // for firefox scrollbars
        };
        // get browser display region height
        if( $.browser.opera ){
            h.doc = document.body.clientHeight;
        }else if( $.browser.safari ){
            h.doc = window.innerHeight;
        }else if( $.browser.msie ){
            h.doc = document.documentElement.clientHeight;
            h.trivials = -10;
        }else{
            h.doc = document.documentElement.clientHeight;
        }
        h.navi_head = h.navi_head + $( 'div.navi > .head' ).height();
        h.hd = h.hd + $( '#hd' ).height();
        h.ft = h.ft + $( '#ft' ).height();
        // pixel calculation 
        this._height.navi = h.doc - h.hd - h.ft - h.navi_pads
            - h.navi_head - h.navi_unknown - h.trivials;
        this._height.map = h.doc - h.hd - h.ft - h.map_pads - h.trivials;
        this.elm.navi.height( this._height.navi );
        this.elm.vearth.height( this._height.map );
        // for virtual earth object
        if( this.vearth ){
            var cont = $( '#bd .map > .cont' );
            this.vearth.map.Resize( cont.width(), cont.height() );
        }

        //$.log( 'doc:' + h.doc );
        //$.log( 'navi_head: ' + h.navi_head );
        //$.log( 'navi_pads: ' + h.navi_pads );
        //$.log( 'hd: ' + h.hd );
        //$.log( 'ft: ' + h.ft );
        //$.log( 'result navi_val:' + this._height.navi );
        //$.log( 'result map_val:' + this._height.map );
    },
    _create_keycrowd: function ( tgt ){
        var _inst = this;
        var links = tgt.find( 'a' );
        // on click handler
        links.click( function (){
            var atag = this;
            $.historyLoad( 'step2_page1', function (){
                if( _inst.vearth ){
                    _inst.vearth.show_controls();
                }
                _inst.city_search( 1, 'keycrowd', { name: atag.innerHTML } );
            });
            return false;
        });
        // make text color gradation
        var defs = [
            { css:{ "font-size":"130%" }, color:-70 },
            { css:{ "font-size":"110%" }, color:-45 },
            { css:{ "font-size":"100%" }, color:-20 },
            { css:{ "font-size":"90%"  }, color:0   },
            { css:{ "font-size":"85%"  }, color:30  },
            { css:{ "font-size":"75%"  }, color:50  },
            { css:{ "font-size":"70%"  }, color:70  }
        ];
        var basecolor = $( links[0] ).css( 'color' );
        var colors = [];
        if( basecolor.match( /^#/ ) ){
            // type: #112233
            colors = basecolor.match( /(\w{2})(\w{2})(\w{2})/ );
            colors.shift();
            $.each( colors, function (i){
                colors[i] = parseInt( colors[i], 16 );
            });
        }else if( basecolor.match( /^rgb/ ) ){
            // type: rgb( 0, 0, 0 )
            colors = basecolor.match( /(\d+), (\d+), (\d+)/ );
            colors.shift();
            $.each( colors, function (i){
                colors[i] = parseInt( colors[i] );
            });
        }else{
            $.log( 'unexpected color type: ' + basecolor );
            colors = [ 125, 125, 125 ];
        }

        var chunk = parseInt( links.length / defs.length );
        var now_def = 1;
        $.each( links, function (i){
            if( i + 1 > chunk * now_def && now_def < defs.length ){
                now_def += 1;
            }
            var self = $( this );
            var d = defs[ now_def - 1 ];
            self.css( d.css );
            var myc = [];
            $.each( colors, function (x){
                myc[x] = colors[x] + d.color;
                if( myc[x] < 0   ){ myc[x] = 0   }
                if( myc[x] > 255 ){ myc[x] = 255 }
            });
            var rgb = 'rgb(' + myc[0] + ', ' + myc[1] + ', ' + myc[2] + ')';
            $.log( rgb );
            self.css( 'color', rgb );
        });
    },
    _to_comma_int: function ( from ){
        from = String( from );
        var to = from;
        var tmp = "";
        while (to != (tmp = to.replace(/^([+-]?\d+)(\d\d\d)/,"$1,$2"))){
            to = tmp;
        }
        return to;
    },
    _truncate_str: function ( str, delim, to ){
        if( !delim ){ delim = '、' }
        if( !to    ){ to = 2 }
        var tmp = str.split( delim );
        var arr = [];
        for ( var i=0; i<tmp.length; i++ ){
            if( i + 1 > to ){ break }
            var s = tmp[i];
            if( s.length > 20 ){
                s = s.substr( 0, 20 ) + '...';
            }
            arr.push( s );
        }
        var s = arr.join( delim );
        if( tmp.length > to ){
            s += ' ほか';   
        }
        return s;
    }
};

})(jQuery);

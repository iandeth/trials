(function($){

VEarth = function() {
    this.constructor.apply( this, arguments );
};

VEarth.prototype = {
    constructor: function ( hash ){
        $.extend( this, {
            id:     hash.id,
            map:    null,
            cities: {},
            spots:  {},
            zoomLevel: 3,
            api_key: hash.api_key,
            show_control: hash.show_control == null ? true : hash.show_control,
            spots_navi: null,
            current_spot: null,
            mode_3d: hash.mode_3d == null ? true : hash.mode_3d,
            hotel_layer: null,
            spot_layer: null,
            main_layer: null,
            tour_layers: {},
            current_tour_id: null,
            logo_disp_flag: false,
            stop_pan: false,
            abort: false,
            dept_cities: {
                NRT: {
                    latlng: new VELatLong( 35.774877, 140.388429 ),
                    name: '成田'
                },
                TYO: {
                    latlng: new VELatLong( 35.774877, 140.388429 ),
                    name: '東京'
                },
                HND: {
                    latlng: new VELatLong( 35.551013, 139.786477 ),
                    name: '羽田'
                },
                OSA: {
                    latlng: new VELatLong( 34.43831, 135.243587 ),
                    name: '大阪'
                },
                KIX: {
                    latlng: new VELatLong( 34.43831, 135.243587 ),
                    name: '関西'
                },
                NGO: {
                    latlng: new VELatLong( 34.862694, 136.815233 ),
                    name: '名古屋'
                },
                FUK: {
                    latlng: new VELatLong( 33.597928, 130.442176 ),
                    name: '福岡'
                }
            },
            view: {
                cities: {
                    D17: { zoom:14, pitch:-27.2 },
                    YQB: { zoom:18 },
                    D12: { zoom:17, head:171.12 },
                    YMQ: { zoom:16, pitch:-28.15, head:236.67 },
                    NYC: { zoom:16 },
                    SEA: { zoom:17, head:162.7 },
                    QZB: { pitch:-29.21 },
                    PAR: { zoom:15 },
                    ROM: { zoom:16 },
                    VCE: { zoom:16, head:318.57 },
                    FLR: { zoom:17, pitch:-34.51, head:165.56 },
                    HKG: { zoom:15, head:167.74 },
                    SFO: { zoom:15, pitch:-28.64, head:47.38 },
                    SYD: { zoom:15 }
                }
            }
        });
        this.map = new VEMap( this['id'] );
        
        if( this.show_control == 'tiny' ){
            this.map.SetDashboardSize( VEDashboardSize.Tiny );
        }
        var _inst = this;
        this.map.onLoadMap = function(){
            _inst._init_map();
        };
        var mode = VEMapMode.Mode2D;
        this.map.LoadMap( new VELatLong(35.22, 135.44), 2,
            'h', false, mode, false );
    },
    _init_map: function(){
        if (this.abort){
            return false;
        }
        // 最初はコントロールを隠しておく。
        // キーワード検索実行時と共に表示する。
        //this.map.HideDashboard();
        // 噴出しのCSSをリセット
        //this.map.ClearInfoBoxStyles();

        var _inst = this;
        this.map.AttachEvent("onmouseover", function(e){
            if (e.elementID){
                var shape = _inst.map.GetShapeByID(e.elementID);
                if (shape.item_type == 'city'){
                    //$.log( "City" + _inst.cities[ shape.item_code ].name
                    //    + "のアイコン mouse over" );
                    _inst._hilight_city( shape.item_code );
                }else if (shape.item_type == 'spot'){
                    _inst._hilight_spot( shape.item_code );
                }
            }
        });
        this.map.AttachEvent("onmouseout", function(e){
            if (e.elementID){
                var shape = _inst.map.GetShapeByID(e.elementID);
                if (shape.item_type == 'city'){
                    _inst._hilight_city( shape.item_code, 1 );
                }else if (shape.item_type == 'spot'){
                    _inst._hilight_spot( shape.item_code, 1 );
                }
            }
        });
        this.map.SetScaleBarDistanceUnit(VEDistanceUnit.Kilometers);
        this.main_layer =  new VEShapeLayer();
        this.map.AddShapeLayer(this.main_layer);
        this.spot_layer =  new VEShapeLayer();
        this.map.AddShapeLayer(this.spot_layer);
        this.init(1000,true);
    },
    show_logo: function (){
        var el = $( '#logo' ).click( function (){
                $( this ).fadeOut( 'normal', function (){
                    $( '#shim_' + this.id ).hide();
                });
            }).show();
        this.map.AddControl( el[0] );
        this._add_shim( el[0] );
    },
    _add_shim: function ( el ){
        if( this.map.GetMapMode() != VEMapMode.Mode3D ){ return false }
        var s = document.createElement( "iframe" );
        s.id = "shim_" + el.id;
        s.frameBorder = "0";
        s.style.position = "absolute";
        s.style.zIndex = "1";
        s.style.top = el.offsetTop;
        s.style.left = el.offsetLeft;
        s.style.background = 'black';
        s.width = el.offsetWidth;
        s.height = el.offsetHeight;
        s.allowtransparency = "true";
        s.scrolling="no";
        s.className="Shim";
        el.shimElement = s;
        el.parentNode.insertBefore( s, el );
    },
    init: function(delay,zoom){
        var _inst = this;
        delay = delay || 5000;
        this.map.EndContinuousPan();
        this.map.SetMapStyle( VEMapStyle.Hybrid );
        this.clear_cities();
        this.clear_spots();
        this.cities = {};
        this.spots = {};
        this.init_zoom( zoom );
        this.stop_pan = false;
        this.st = setInterval( function(){
            _inst._wait(_inst.zoomLevel);
        }, delay);
    },
    init_zoom: function(show_logo){
        if(!show_logo && this.logo_disp_flag){
           this.map.DeleteTileLayer("logo");
           this.logo_disp_flag = false;
        }
        var viewspec = new VEMapViewSpecification(
            this.map.GetCenter(), this.zoomLevel, null, -90, 0 );
        this.map.SetMapView(viewspec);
    },
    plot_logo_pin: function (){
        var tile = new VETileSourceSpecification(
            'logo',
            "http://mtl.recruit.co.jp/sandbox/virtual_earth"
                + "/img/large_logo.gif"
        );
        tile.Bounds = [ new VELatLongRectangle(
            new VELatLong( 41, 115 ),
            new VELatLong( 41, 115 ),
            new VELatLong( 41, 115 ),
            new VELatLong( 41, 115 )
        )];
        this.map.AddTileLayer( tile, true );
        this.logo_disp_flag = true;
    },
    _wait: function( z ){
        if (!this.stop_pan){
            this.map.StartContinuousPan(-1,0);
        }
        clearInterval(this.st);
    },
    hide_route: function(){
        if (this.current_tour_id){
            this.tour_layers[this.current_tour_id].Hide();
            this.current_tour_id = null;
        }
        this.main_layer.Show();
    },
    _make_latlng: function(city){
        var latlng = null;
        if ((city.lat != '') && (city.lng != '')){
            var lat = parseFloat(city.lat);
            var lng = parseFloat(city.lng);
            latlng = new VELatLong(lat,lng);
        }
        return latlng;
    },
    clear_cities: function(){
        //Map上にあるすべての都市のシェイプを削除
        for (var i in this.cities){
            if (this.cities[i].shape){
                this.map.DeleteShape(this.cities[i].shape);
                this.cities[i].shape = null;
            }
        }
        //this.hide_spots_navi();
        this.hide_route();
    },
    plot_cities: function( cities ){
        this.map.EndContinuousPan();
        this.stop_pan = true;
        //引数はエイビーロードWebサービスのcityオブジェクトの配列
        for(var i in cities){
            var city = cities[i];
            var latlng;
            if (this.cities[city.code]){
                city = this.cities[city.code];
                latlng = city.latlng;
            }else{
                this.cities[city.code] = city;
                latlng = this._make_latlng(city);
                city.latlng = latlng;
            }
            if (city.shape == null && latlng){
                var shape;
                var _inst = this;
                shape = new VEShape(VEShapeType.Pushpin, latlng);
                shape.item_type = "city";
                shape.item_code = city.code;
                shape.SetTitle( city.name );
                shape.SetDescription(
                    '<div>' + city.area.name + ' &gt; ' + city.country.name
                    + ' &gt; ' + city.name + '</div>'
                    + '<div style="text-align:right;margin-top:5px">'
                    + '<a href="#" onclick="'
                    + '$(\'#li_city_' + city.code + '\' ).dblclick();'
                    + 'return false">[ 都市の詳細を見る ]</a></div>'
                );
                city.shape = shape;
                this._set_city_custom_icon( city, null, shape );
                this.main_layer.AddShape( shape );
            }
        }
    },
    _set_city_custom_icon: function ( city, active ){
        if( !city || !city.tour_count || !city.shape ){ return false }
        var x = 0;
        var y = 0;
        var image_src = '';
        var image_size = 0;
        if ( parseInt( city.tour_count ) < 10 ){
            image_src = "./img/blue_0.png";
            x = 1;
            y = 1;
            image_size = 16;
        }else if ( parseInt( city.tour_count ) < 100 ){
            image_src = "./img/blue_1.png";
            x = 6;
            y = 8;
            image_size = 32;      
        }else{
            image_src = "./img/blue_2.png";
            x = 13;
            y = 16;
            image_size = 48;
        }
        if( active ){
            image_src = image_src.replace( 'blue', 'gray' );
        }
        var icon = '<span class="pin" style="padding-top:' + y
            + 'px;background:url(' + image_src + ') no-repeat;height:'
            + image_size +'px;width:'+ image_size + 'px;">'
            + city.tour_count + "</span>";
        city.shape.SetCustomIcon( icon );
        return true;
    },
    focus_city: function( city ){
        this.map.EndContinuousPan();
        if (city && city.code){
            var mycity = this.cities[ city.code ];
            if( !mycity ){ return }
            //指定の都市にパン
            var latlng = mycity.latlng;
            if ( latlng ){
                var _inst = this;
                this.map.PanToLatLong( latlng );
                if( mycity.shape ){
                    // register on end zoom handler
                    //var _inst = this;
                    //var func = function (){
                    //    _inst.map.DetachEvent( "onendpan", func );
                    //    var to = setTimeout( function (){
                    //            _inst.map.ShowInfoBox( mycity.shape );
                    //            clearTimeout( to );
                    //        }, 10 );
                    //}
                    //this.map.AttachEvent( "onendpan", func );
                }
                //this.show_spots_navi();
            }else{
                this.map.ShowMessage(city.name + '緯度経度不明');
            }
        }
    },
    _hilight_city: function ( city_code, reset ){
        if( !city_code ){ return false }
        var mycity = this.cities[ city_code ];
        if( !mycity ){ return }
        if( reset ){
            this._set_city_custom_icon( mycity, null ); 
        }else{
            this._set_city_custom_icon( mycity, 'active' ); 
        }
        return true;
    },
    clear_spots: function(){
        //Map上にあるすべてのspots(観光地)を削除
        for (var i in this.spots){
            if (this.spots[i].shape){
                this.map.DeleteShape(this.spots[i].shape);
                this.spots[i].shape = null;
            }
        }
        this.hide_route();
    },
    focus_spots: function( city ){
        // 都市＋観光地全体の矩形を表示ではなく、
        // 都市のみを拡大表示
        if( this.cities[ city.code ] ){
            this.map.EndContinuousPan();
            //viewspec = new VEMapViewSpecification(
            //    this.cities[city.code].latlng, 16, null, -35.2, 0 );
            //this.map.SetMapView( viewspec );

            // register on end zoom handler
            //var _inst = this;
            //var func = function (){
            //    _inst.map.DetachEvent( "onendpan", func );
            //    var to = setTimeout( function (){
            //            _inst.map.ShowInfoBox( _inst.cities[city.code].shape );
            //            clearTimeout( to );
            //        }, 1 );
            //}
            //this.map.AttachEvent( "onendpan", func );

            var zoom = 12;
            var pitch = -35.2;
            var heading = 0;
            if( this.view.cities[ city.code ] ){
                var v = this.view.cities[ city.code ];
                zoom = v.zoom || zoom;
                pitch = v.pitch || pitch;
                heading = v.head || heading;
            }
            var viewspec = new VEMapViewSpecification(
                this.cities[city.code].latlng,
                zoom, null, pitch, heading
            );
            this.map.SetMapView( viewspec );
            return true;
        }else{
            return false;
        }
    },
    _make_spot_shape: function( spot ){
        var latlng = this._make_latlng(spot);
        var shape = null;
        if (latlng){
            var shape = new VEShape(VEShapeType.Pushpin, latlng);
            shape.item_code = spot.code;
            shape.item_type = 'spot';
            shape.SetTitle( spot.name );
            var desc = '';
            if( spot.photo && spot.photo.url ){
                desc += '<div style="text-align:center;margin:10px">'
                    + '<img src="' + spot.photo.url
                    + '" width="' + spot.photo.width
                    + '" height="' + spot.photo.height + '"/>'
                    + '</div>';
            }
            
            var spot_url = "http://ab.ab-road.net/INFO/SIGHT/" + spot.code + ".html";
            spot_url = spot.url;
            desc += '<div class="desc">'
                + '<strong>' + spot.title + '</strong> - '
                + spot.description 
                + '</div>'
                + '<div style="float:left;font-size:120%"><a href="#" onclick="'
                + 'myapp.vearth.map.HideInfoBox();return false;'
                + '"><strong>[閉じる]</strong></a></div>'
                + '<div style="text-align:right;font-size:120%">'
                    + '<a href="' + spot_url + '" target="_blank">&gt;&gt;詳細ページへ</a>'
                + '</div>';
            shape.SetDescription( desc );
            spot.latlng = latlng;
            icon = '<img src="./img/orange_0.png" border="0"/>';

            shape.SetCustomIcon( icon );
        }
        return shape;
    },
    _add_spots: function( city , spots ){
        //指定されたspotsを追加
        for(var i in spots){
            var spot = spots[i];
            var shape = null;
            if (!spot.shape){
                shape = this._make_spot_shape( spot ) ;
                if (shape){
                    this.spot_layer.AddShape(shape);
                }
                spot.shape = shape;
                this.spots[spot.code] = spot;
            }
        }
        if ( this.cities[city.code] == null){
             this.cities[city.code] = city;
        }
        this.cities[city.code].spots = spots;
        this.focus_spots(city);
    },
    plot_spots: function( city , spots , func){
        if (city && city.code){
            //すでにあるspots(観光地)を消す
            this.clear_spots();
            if (spots){
                this._add_spots(city , spots);
            }else if (this.cities[city.code].spots){
                this._add_spots(city , this.cities[city.code].spots);
            }else{
                // リクエスト先 API URL 生成
                var url = 'http://webservice.recruit.co.jp/ab-road/spot/v1/alliance/'
                        + '?format=jsonp&callback={callback}&count=100&'
                        + 'city=' + city.code +'&key=' + this.api_key ;
                var _inst = this;
                $.getJSONP( url, function(tree) {
                    spots = tree.results.spot;
                    _inst._add_spots(city , spots);
                    func();
                });
            }
        }    
    },
    focus_spot: function( myspot , info_window_open){
        this.map.EndContinuousPan();
        if (myspot && myspot.code){
            var spot = this.spots[myspot.code];         
            var shape = spot.shape;       
            if (shape){
                var latlng = spot.latlng;
                if (latlng){
                    if( info_window_open ){
                        // register on end zoom handler
                        var _inst = this;
                        var func = function (){
                            _inst.map.DetachEvent( "onendpan", func );
                            var to = setTimeout( function (){
                                    _inst.map.ShowInfoBox( shape );
                                    clearTimeout( to );
                                }, 1 );
                        }
                        this.map.AttachEvent( "onendpan", func );
                    }

                    this.map.PanToLatLong(latlng);
                    //if (this.map.IsBirdseyeAvailable()){
                        //var bi = this.map.GetBirdseyeScene();
                        
                        //this.map.SetMapStyle("o");
                    //}
                }         
            }          
            //this.show_spots_navi();
        }
    },
    _hilight_spot: function ( spot_code, reset ){
        if( !spot_code ){ return false }
        var myspot = this.spots[ spot_code ];
        if( !myspot ){ return false }
        var icon = myspot.shape.GetCustomIcon();
        if( reset ){
            icon = icon.replace( '0_over.png', '0.png' );
        }else{
            icon = icon.replace( '0.png', '0_over.png' );
        }
        myspot.shape.SetCustomIcon( icon );
        return true;
    },
    hide_spots_navi: function (){
        if(this.spots_navi != null){
             this.map.DeleteControl(this.spots_navi);
             this.spots_navi = null;
        }
    },
    show_controls: function (){
        if ( this.show_control ){
            this.map.Show3DNavigationControl();
        }
    },
    travel_path: function( tour ){
        //ツアーの行程をアニメーションする。
        //未表示の都市があれば、追加する。（plot_cities)
        
        var tour_layers = this.tour_layers;
        if(this.current_tour_id == tour.id){
            
        }else if(tour_layers[this.current_tour_id]){
            tour_layers[this.current_tour_id].Hide();
            this.current_tour_id = null;
        }
        this.main_layer.Hide();
        this.current_tour_id = tour.id;
        if (tour_layers[tour.id]){
            tour_layers[tour.id].Show();
            var target_route = tour_layers[tour.id].target_route;
            this.map.SetMapView(target_route);
        }else{
            var _inst = this;
		    var layer = new VEShapeLayer();
		    this.map.AddShapeLayer(layer);
		    tour_layers[tour.id] = layer;
		    
		    this.current_tour_id = tour.id;
		    var route_points = [];
		    //var shape;
		    var x = 10;
            var y = 8;
            var image_src = "./img/blue_1.png";
            var image_size = 32;
            var target_route = [];
            var target_cities = {};
            var route_counter = 0;
            for ( var i in tour.sche ){
                var sche = tour.sche[i];
                if ((sche.city.lat != '') && (sche.city.lng != '')){
                    var lat = parseFloat(sche.city.lat.replace(" ",""));
                    var lng = parseFloat(sche.city.lng.replace(" ",""));
                    var latlng = new VELatLong(lat,lng);
                    //緯度経度が指定されている場合のみ、ピンを立てる
                    (function(){
                        if (!target_cities[sche.city.code]){
                            target_cities[sche.city.code] = 1;
                            route_counter += 1;
                            var shape = new VEShape(VEShapeType.Pushpin, latlng);
                            var icon = new VECustomIconSpecification();
                            icon.TextContent = route_counter.toString();
                            icon.Image = image_src;
                            icon.TextOffset = new VEPixel(x,y);
                            icon.ForeColor  = new VEColor(0,88,168,1);
                            icon.TextSize   = 8;
                            icon.CustomHTML = '<span class="pin" style="padding-top:' + y + 'px;background:url(' + image_src + ') no-repeat;height:'+ image_size +'px;width:'+ image_size +'px;">' + sche.day + "</span>";
                            
                            shape.SetCustomIcon(icon);
                            shape.SetTitle(sche.city.name + '(' + sche.city.code + ')');
                            var info_html = '<div><a href="#" onclick="myapp.vearth.travel();return false;">ルートをアニメーション表示</a></div>';
                            
                            shape.SetDescription(info_html);
                            shape.day = sche.day;

                            layer.AddShape(shape);
                        }
                        route_points.push(latlng);
                        target_route.push(latlng);
                    })();
                }
            };
            var route = new VEShape(VEShapeType.Polyline,route_points);
            route.SetCustomIcon("./img/0.png");
            route.SetLineColor(new VEColor(244,0,0,0.9));
            route.SetLineWidth(5);
            layer.AddShape(route);
            layer.route_points = route_points;
            layer.target_route = target_route;
            this.map.SetMapView(target_route);
        }
    },
    travel: function(){
        var _inst = this;
        if (!this.current_tour_id) {
            return;
        }
        var layer = this.tour_layers[ this.current_tour_id ];
        layer.Show();
        // reserve animation chain
        var resv = [];
        $.log( 'route length is ' + layer.target_route.length );
        for( var i=layer.target_route.length-1; i>=0; i-- ){
            (function (){
                var x = parseInt( i );
                resv[ i ] = function (){
                    $.log( 'callback ' + x );
                    var myp = layer.target_route[ x ];
                    var prevp = layer.target_route[ x-1 ];
                    if(
                        x == 0 ||
                        ( x != layer.target_route.length - 1 && 
                          prevp && myp.Latitude == prevp.Latitude )
                    ){
                        $.log( 'skip to next ' + x );
                        ( resv[ x + 1 ] )();
                        return true;
                    }
                    var func = function (){
                        _inst.map.DetachEvent( "onchangeview", func );
                        if( x == layer.target_route.length - 1  ){
                            $.log( 'onendpan' + x + ' , exiting' );
                            setTimeout( function (){
                                _inst.map.SetMapView( layer.target_route );
                            }, 2000 );
                        }else{
                            $.log( 'onendpan ' + x + ' , to next' );
                            ( resv[ x + 1 ] )();
                        }
                    };
                    _inst.map.AttachEvent( "onchangeview", func );
                    var pin = layer.target_route[ x ];
                    $.log( 'pantolatlong ' + x );
                    $.log( pin );
                    setTimeout( function (){
                        _inst.map.PanToLatLong( pin );
                    }, 2000 );
                };
            })();
        }
        // zoom, and start animation on end zoom.
        var func = function (){
            _inst.map.DetachEvent( "onendzoom", func );
            $.log( 'first zoom end' );
            var func2 = function (){
               _inst.map.DetachEvent( "onchangeview", func2 );
                $.log( 'first change view end' );
                setTimeout( function (){
                    (resv[0])(); // execute first chain
                }, 2000 );
            };
            _inst.map.AttachEvent( "onchangeview", func2 );
            _inst.map.SetCenter( layer.target_route[ 0 ] );
        };
        this.map.AttachEvent( "onendzoom", func );
        this.map.SetZoomLevel( 10 );

        return true;
    }
};

})(jQuery);

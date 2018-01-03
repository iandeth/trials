/*
NAME:

    ABROAD.UI.Places - auto generate on-change syncronized
    area / country / city user-interfaces.

VERSION:

    1.0

SYNOPSIS:

    Currently provides these two classes:

        ABROAD.UI.Places.Pulldown
        ABROAD.UI.Places.Drilldown

    Refer to each class' documentation for details on how
    to use.

AUTHOR:

    Toshimasa Ishibashi
    iandeth [at] gmail.com

CHANGES:

    2007-08-21
        - v1.0 released
*/

// everything wrapped in jQuery -
// same effect as jQuery.noConflict() for use with prototype.js
(function($){


// define parent classes
if( typeof( ABROAD ) != 'function' ) {
    ABROAD = function (){};
}
if( typeof( ABROAD.UI ) != 'function' ) {
    ABROAD.UI = function (){};
}

//
// ABROAD.UI.Places
//
if( typeof( ABROAD.UI.Places ) != 'function' ) {
    ABROAD.UI.Places = function (){
        if( typeof( ABROAD_MASTER_PLACES ) != 'object' ){
            alert( 'abroad.master.places.js が読み込まれていません' );
            return undefined;
        }
    };
}
ABROAD.UI.Places.prototype.find_place =
function ( hash ){
    var prm = $.extend({
        area    : undefined,
        country : undefined,
        city    : undefined
    }, hash );
    // find from city code
    if( prm.city ){
        var ret = undefined;
        $.each( ABROAD_MASTER_PLACES, function (ar){
            var area = ABROAD_MASTER_PLACES[ ar ];
            $.each( area.country, function (co){
                var country = area.country[ co ];
                $.each( country.city, function (ci){
                    var city = country.city[ ci ];
                    if( prm.city == ci ){
                        city.type = 'city';
                        city.area = area;
                        city.country = country;
                        ret = city;
                        return false;
                    }
                });
            });
        });
        return ret;
    }
    // find from country code
    if( prm.country ){
        var ret = undefined;
        $.each( ABROAD_MASTER_PLACES, function (ar){
            var area = ABROAD_MASTER_PLACES[ ar ];
            $.each( area.country, function (co){
                var country = area.country[ co ];
                if( prm.country == co ){
                    country.type = 'country';
                    country.area = area;
                    ret = country;
                    return false;
                }
            });
        });
        return ret;
    }
    // find from area code
    if( prm.area ){
        var ret = undefined;
        $.each( ABROAD_MASTER_PLACES, function (ar){
            var area = ABROAD_MASTER_PLACES[ ar ];
            if( prm.area == ar ){
                area.type = 'area';
                ret = area;
                return false;
            }
        });
        return ret;
    }
}

//
// ABROAD.UI.Places.Pulldown
//
/*
NAME

    ABROAD.UI.Places.Pulldown - auto syncronized area, country, city
    form pulldown (<select>'s).

SYNOPSIS


DESCRIPTION

    
*/
ABROAD.UI.Places.Pulldown = function() {
    this.constructor.apply(this, arguments);
};
ABROAD.UI.Places.Pulldown.prototype = {
    constructor: function ( hash ){
        var prm = $.extend({
            id_area         : 'ab-area-sel',
            id_country      : 'ab-country-sel',
            id_city         : 'ab-city-sel',
            first_opt_text  : '指定なし',
            with_tour_count : false
        }, hash );
        // first option text
        this.first_opt_text = prm.first_opt_text;
        // tour count display
        this.with_tour_count = prm.with_tour_count;
        // select elements
        this.elm = {
            area    : $( '#' + prm.id_area ),
            country : $( '#' + prm.id_country ),
            city    : $( '#' + prm.id_city ) 
        };
        // error check
        if( this.elm.area.length == 0 ){
            alert( 'ABROAD.UI.Places.Pulldown\n'
                + 'エリアのプルダウンが見つかりません\n'
                + 'id: ' + prm.id_area );
            return undefined;
        }
        // add name attribute if not present
        var names = {
            area    : 'area',
            country : 'country',
            city    : 'city' 
        };
        var _inst = this;
        $.each( names, function (k){
            var elm = _inst.elm[ k ];
            if( elm.length && !elm.attr( 'name' ) ){
                elm.attr( 'name', names[ k ] );
            }
        });
        // add on-change events
        if( !this.elm.country ){ return }
        this.elm.area.change( function (){
            _inst.change_country();
        });
        if( !this.elm.city ){ return }
        this.elm.country.change( function (){
            _inst.change_city();
        });
    },
    init: function ( arg ){
        var prm = $.extend({
            area    : undefined,
            country : undefined,
            city    : undefined
        }, arg);
        // resolve each pulldown value
        var vals = this.find_place( prm ) || {};
        // set pulldown values;
        if( vals.type == 'city' ){
            this.change_area( vals.area.code );
            this.change_country( vals.country.code );
            this.change_city( vals.code );
        }else if( vals.type == 'country' ){
            this.change_area( vals.area.code );
            this.change_country( vals.code );
            this.change_city();
        }else if( vals.type == 'area' ){
            this.change_area( vals.code );
            this.change_country();
        }else{
            this.change_area();
        }
    },
    change_area: function ( default_val ){
        this._reset_pulldown( this.elm.area );
        this._reset_pulldown( this.elm.country );
        this._reset_pulldown( this.elm.city );
        var pull = this.elm.area;
        var _inst = this;
        $.each( ABROAD_MASTER_PLACES, function (code){
            var itm = ABROAD_MASTER_PLACES[ code ];
            var opt = document.createElement( "OPTION" );
            opt.value = code;
            if( code == default_val ){
                opt.selected = true;
            }
            var label = _inst._create_option_label( itm );
            var txt = document.createTextNode( label );
            $( opt ).append( txt );
            pull.append( opt );
        }); 
    },
    change_country: function ( default_val ){
        this._reset_pulldown( this.elm.country );
        this._reset_pulldown( this.elm.city );
        var ar = this.elm.area.val();
        if( !ar ){ return }
        var country = ABROAD_MASTER_PLACES[ ar ].country;
        var pull = this.elm.country;
        var _inst = this;
        $.each( country, function (code){
            var itm = country[ code ];
            var opt = document.createElement( "OPTION" );
            opt.value = code;
            if( code == default_val ){
                opt.selected = true;
            }
            var label = _inst._create_option_label( itm );
            var txt = document.createTextNode( label );
            $( opt ).append( txt );
            pull.append( opt );
        }); 
    },
    change_city: function ( default_val ){
        this._reset_pulldown( this.elm.city );
        var ar = this.elm.area.val();
        var co = this.elm.country.val();
        if( !co ){ return }
        var city = ABROAD_MASTER_PLACES[ ar ].country[ co ].city;
        var pull = this.elm.city;
        var _inst = this;
        $.each( city, function (code){
            var itm = city[ code ];
            var opt = document.createElement( "OPTION" );
            opt.value = code;
            if( code == default_val ){
                opt.selected = true;
            }
            var label = _inst._create_option_label( itm );
            var txt = document.createTextNode( label );
            $( opt ).append( txt );
            pull.append( opt );
        }); 
    },
    _reset_pulldown: function ( elm ){
        if( !elm ){ return }
        elm.empty();
        elm.append( '<option value="">'
            + this.first_opt_text + '</option>' );
    },
    _create_option_label: function ( itm ){
        var label = itm.name;
        if( this.with_tour_count ){
            label += '  (' + itm.count + ')';
        }
        return label;
    },
    // should use method override, but for now...
    find_place: function ( arg ){
        return new ABROAD.UI.Places().find_place( arg );
    }
};

//
// ABROAD.UI.Places.Drilldown
//
ABROAD.UI.Places.Drilldown = function() {
    this.constructor.apply(this, arguments);
};
ABROAD.UI.Places.Drilldown.prototype = {
    constructor: function ( hash ){
        var prm = $.extend( {
            id                 : 'ab-places-ul',
            navi1_id           : 'ab-places-navi1',
            navi2_id           : 'ab-places-navi2',
            area_li_class      : 'ab-places-li-area',
            country_li_class   : 'ab-places-li-country',
            city_li_class      : 'ab-places-li-city',
            area_click         : undefined,
            country_click      : undefined,
            city_click         : undefined,
            add_li_post_hook   : undefined,
            with_tour_count    : false,
            add_hover_class    : true,
            add_click_effects  : true,
            click_effects_post_hook: undefined,
            navi1_top_style    : { 'color': '#CCC' },
            fx_speed           : 'fast'
        }, hash );
        // li element class names
        this.classes = {
            li : {
                area    : prm.area_li_class,
                country : prm.country_li_class,
                city    : prm.city_li_class
            }
        };
        // li on-click handlers
        this.handler = {
            click : {
                area    : prm.area_click,
                country : prm.country_click,
                city    : prm.city_click
            }
        };
        // keep track of current selection
        this.current = {
            area    : undefined,
            country : undefined,
            city    : undefined
        };
        // tour count display
        this.with_tour_count = prm.with_tour_count;
        // add class="hover" to <li> on mouse-over
        this.add_hover_class = prm.add_hover_class;
        // custom hook when adding new li element
        this.add_li_post_hook = prm.add_li_post_hook;
        // add hide effects on <li> clicking
        this.add_click_effects = prm.add_click_effects;
        this.click_effects_post_hook = prm.click_effects_post_hook;
        // ab-places-navi1 > 'TOP' string's style
        this.navi1_top_style = prm.navi1_top_style;
        // animation speed
        this.fx_speed = prm.fx_speed;
        // find elements
        this.elm = {
            ul     : $( 'ul#' + prm.id ),
            navi1  : $( '#' + prm.navi1_id ),
            navi2  : $( '#' + prm.navi2_id )
        };
        // error check
        if( this.elm.ul.length == 0 ){
            alert( 'ABROAD.UI.Places.Drilldown\n'
                + '選択リストが見つかりません\n'
                + 'id: ' + prm.id );
            return undefined;
        }
    },
    init: function ( hash ){
        // var prm = $.extend( {}, hash );
        this._update_current();
        this.create_area_list();
    },
    create_area_list: function (){
        var _inst = this;
        $.each( ABROAD_MASTER_PLACES, function ( ar ){
            var itm = ABROAD_MASTER_PLACES[ ar ];
            var label = _inst._create_label( itm );
            var li = $( '<li><a href="">' + label + '</a></li>' )
                .addClass( _inst.classes.li.area );
            li.find( 'a' ).click( function (){
                // with user custom handler
                if( typeof( _inst.handler.click.area ) == 'function' ){
                    _inst._update_current( 'area', itm, 1 );
                    _inst.handler.click.area( itm );
                // default handler
                }else{
                    var task = function (){
                        _inst._update_current( 'area', itm );
                        _inst.create_country_list( itm );
                    };
                    _inst._add_li_click_effects( task );
                }
                return false;
            });
            _inst._add_hover_handler( li );
            if( typeof( _inst.add_li_post_hook ) == 'function' ){
                _inst.add_li_post_hook( 'area', li );
            }
            li.appendTo( _inst.elm.ul );
        });
    },
    create_country_list: function ( area ){
        var _inst = this;
        $.each( area.country, function ( co ){
            var itm = area.country[ co ];
            var label = _inst._create_label( itm );
            var li = $( '<li><a href="">' + label + '</a></li>' )
                .addClass( _inst.classes.li.country );
            li.find( 'a' ).click( function (){
                // with user custom handler
                if( typeof( _inst.handler.click.country ) == 'function' ){
                    _inst._update_current( 'country', itm, 1 );
                    _inst.handler.click.country( itm );
                // default handler
                }else{
                    var task = function (){
                        _inst._update_current( 'country', itm );
                        _inst.create_city_list( itm );
                    };
                    _inst._add_li_click_effects( task );
                }
                return false;
            });
            _inst._add_hover_handler( li );
            if( typeof( _inst.add_li_post_hook ) == 'function' ){
                _inst.add_li_post_hook( 'country', li );
            }
            li.appendTo( _inst.elm.ul );
        });
    },
    create_city_list: function ( country ){
        var _inst = this;
        $.each( country.city, function ( ci ){
            var itm = country.city[ ci ];
            var label = _inst._create_label( itm );
            var li = $( '<li><a href="">' + label + '</a></li>' )
                .addClass( _inst.classes.li.city );
            li.find( 'a' ).click( function (){
                // with user custom handler
                if( typeof( _inst.handler.click.city ) == 'function' ){
                    _inst._update_current( 'city', itm, 1 );
                    _inst.handler.click.city( itm );
                // default handler
                }else{
                    _inst._update_current( 'city', itm, 1 );
                    alert( 'ABROAD.UI.Places.Drilldown\n'
                        + 'you clicked: ' + itm.code + '\n' );
                }
                return false;
            });
            _inst._add_hover_handler( li );
            if( typeof( _inst.add_li_post_hook ) == 'function' ){
                _inst.add_li_post_hook( 'city', li );
            }
            li.appendTo( _inst.elm.ul );
        });
    },
    _create_label: function ( itm ){
        var label = itm.name;
        if( this.with_tour_count ){
            label += '  (' + itm.count + ')';
        }
        return label;
    },
    _empty_elems: function (){
        var _inst = this;
        $.each( this.elm, function (k){
            _inst.elm[ k ].empty();
        });
    },
    _add_hover_handler: function ( li ){
        if( this.add_hover_class ){
            li.find( 'a' ).hover(
                function(){ $(this).addClass("hover") },
                function(){ $(this).removeClass("hover") }
            );
        }
    },
    _add_li_click_effects: function ( my_task ){
        if( this.add_click_effects ){
            var speed = this.fx_speed;
            var _inst = this;
            this.elm.ul.hide( speed, function (){
                my_task();
                if( _inst.click_effects_post_hook ){
                    $( this ).show( speed, _inst.click_effects_post_hook );
                }else{
                    $( this ).show( speed );
                }
            });
        }else{
            my_task();
        }
    },
    _update_current: function ( type, itm, no_ui_update ){
        var _inst = this;
        if( type == 'area' ){
            // update instance state property
            this.current.area    = itm;
            this.current.country = undefined;
            this.current.city    = undefined;
            // update ui display 
            if( no_ui_update ){ return }
            this._empty_elems();
            var handler = function (){
                _inst._update_current();
                _inst.create_area_list();
            };
            if( this.elm.navi1.length ){
                this.elm.navi1.html( '<a href="">TOP</a> &gt; '
                    + itm.name ).find( 'a' ).click( function (){
                        _inst._add_li_click_effects( handler );
                        return false;
                    });
            }
            if( this.elm.navi2.length ){
                this.elm.navi2.html( '<a href="">エリア選択に戻る</a>' )
                    .find( 'a' ).click( function (){ 
                        _inst._add_li_click_effects( handler );
                        return false;
                    });
            }
        }else if( type == 'country' ){
            // update instance state property
            this.current.country = itm;
            this.current.city    = undefined;
            // update ui display 
            if( no_ui_update ){ return }
            this._empty_elems();
            var area = _inst.current.area;
            var handler = function (){
                _inst._update_current( 'area', area );
                _inst.create_country_list( area );
                return false;
            };
            if( this.elm.navi1.length ){
                var area_handler = function (){
                    _inst._update_current();
                    _inst.create_area_list();
                    return false;
                };
                this.elm.navi1.html( '<a href="">TOP</a> &gt; '
                    + '<a href="">' + area.name + '</a> &gt; ' + itm.name );
                $( this.elm.navi1.find( 'a' )[0] ).click( function (){ 
                    _inst._add_li_click_effects( area_handler );
                    return false;
                });
                $( this.elm.navi1.find( 'a' )[1] ).click( function (){
                    _inst._add_li_click_effects( handler );
                    return false;
                });
            }
            if( this.elm.navi2.length ){
                this.elm.navi2.html( '<a href="">国選択に戻る</a>' )
                    .find( 'a' ).click( function (){
                        _inst._add_li_click_effects( handler );
                        return false;
                    });
            }
        }else if( type == 'city' ){
            // update instance state property
            this.current.city = itm;
        }else{
            // reset all
            // update instance state property
            this.current.area    = undefined;
            this.current.country = undefined;
            this.current.city    = undefined;
            // update ui display 
            if( no_ui_update ){ return }
            this._empty_elems();
            if( this.elm.navi1.length ){
                this.elm.navi1.html( '<span>TOP</span>' )
                    .find( 'span' ).css( this.navi1_top_style );
            }
        }
    }
};

// end of jQuery no-conflict wrapper
})(jQuery);

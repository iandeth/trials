/*
 * beauty.ui.js - UI library for Beauty Web Service
 * AUTHOR: Toshimasa Ishibashi iandeth [at] gmail.com
 * VERSION: 1.00
 */

// everything wrapped in jQuery -
// same effect as jQuery.noConflict() for use with prototype.js
(function($){

if( typeof( Beauty ) != 'function' ) {
    Beauty = function (){};
}
if( typeof( Beauty.UI ) != 'function' ) {
    Beauty.UI = function (){};
}

/*
 * Beauty.UI.Places.Pulldown - エリア選択 プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-01 v1.00 released
 */
if( typeof( Beauty.UI.Places ) != 'function' ) {
    Beauty.UI.Places = function (){};
}
/*
 * Beauty.UI.Places
 */
Beauty.UI.Places.find_place_by_code = function ( hash ){
    hash = $.extend({
        service_area:       undefined,
        middle_area:        undefined,
        small_area:         undefined,
        callback:           function (){}
    }, hash );
    var drv_sa = new Recruit.UI.Driver.JSONP({
        url: 'http://webservice.recruit.co.jp/beauty/service_area/v1/'
    });
    var drv_ma = new Recruit.UI.Driver.JSONP({
        url: 'http://webservice.recruit.co.jp/beauty/middle_area/v1/'
    });
    var drv_sma = new Recruit.UI.Driver.JSONP({
        url: 'http://webservice.recruit.co.jp/beauty/small_area/v1/'
    });
    if( hash.service_area ){
        drv_sa.get( function ( success ){
            if( !success ){ return } 
            var res = {};
            $.each( this.results.service_area, function (){
                if( hash.service_area == this.code ){
                    res = this;
                    return false;
                }
            });
            hash.callback( res );
        });
    }else if( hash.middle_area ){
        drv_ma.get( function ( success ){
            if( !success ){ return } 
            var res = {};
            $.each( this.results.middle_area, function (){
                if( hash.middle_area == this.code ){
                    res = this;
                    return false;
                }
            });
            hash.callback( res );
        }, { middle_area: hash.middle_area } );
    }else if( hash.small_area ){
        drv_sma.get( function ( success ){
            if( !success ){ return } 
            var res = {};
            $.each( this.results.small_area, function (){
                if( hash.small_area == this.code ){
                    res = this;
                    return false;
                }
            });
            hash.callback( res );
        }, { small_area: hash.small_area } );
    }
    return false;
};

/*
 * Beauty.UI.Places.Pulldown
 */
Beauty.UI.Places.Pulldown = Class.create({
    initialize: function ( hash ){
        if( typeof hash != 'object' ){ hash = {} }
        var prm_sa  = $.extend( {}, hash.service_area );
        var prm_ma  = $.extend( {}, hash.middle_area );
        var prm_sma = $.extend( {}, hash.small_area );
        // does it need default val resolving?
        var def_type = '';
        if    ( prm_sma.val ){ def_type = 'small_area'   }
        else if( prm_ma.val ){ def_type = 'middle_area'  }
        // define post handler
        var _self = this;
        var process = function ( itm ){
            if( def_type == 'small_area' ){
                prm_sa.val                = itm.service_area.code;
                prm_ma.service_area       = itm.service_area.code;
                prm_ma.val                = itm.middle_area.code;
                prm_sma.middle_area       = itm.middle_area.code;
            }else if( def_type == 'middle_area' ){
                prm_sa.val                = itm.service_area.code;
                prm_ma.service_area       = itm.service_area.code;
            }
            // create pulldown
            var sa  = new Beauty.UI.Places.ServiceArea.Pulldown( prm_sa );
            var ma  = new Beauty.UI.Places.MiddleArea.Pulldown( prm_ma );
            var sma = new Beauty.UI.Places.SmallArea.Pulldown( prm_sma );
            if( sa.elm.length  > 0 ){ this.service_area = sa        }
            if( ma.elm.length  > 0 ){ this.middle_area  = ma        }
            if( sma.elm.length > 0 ){ this.small_area   = sma       }
            // add on change handler
            if( this.service_area && this.middle_area ){
                this.service_area.elm.change( function (){
                    if( _self.small_area ){
                        _self.small_area.reset_ui();
                    }
                    _self.middle_area.service_area =
                        _self.service_area.elm.val();
                    _self.middle_area.update_ui();
                });
            }
            if( this.middle_area && this.small_area ){
                this.middle_area.elm.change( function (){
                    _self.small_area.middle_area =
                        _self.middle_area.elm.val();
                    _self.small_area.update_ui();
                });
            }
        };
        // do ajax default code resolving
        if( def_type == 'small_area' ){
            Beauty.UI.Places.find_place_by_code({
                small_area: prm_sma.val,
                callback: function ( itm ){
                    process.apply( _self, [ itm ] );
                }
            });
        }else if( def_type == 'middle_area' ){
            Beauty.UI.Places.find_place_by_code({
                middle_area: prm_ma.val,
                callback: function ( itm ){
                    process.apply( _self, [ itm ] );
                }
            });
        }else{
            process.apply( this, [] ); 
        }
    }
});

/*
 * Beauty.UI.Places.ServiceArea.Pulldown
 */
if( typeof( Beauty.UI.Places.ServiceArea ) != 'function' ) {
    Beauty.UI.Places.ServiceArea = function (){};
}
Beauty.UI.Places.ServiceArea.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id         : 'bty-service-area-sel',
            name       : 'service_area',
            label      : 'サービスエリア',
            has_parent : false
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/beauty'
                + '/service_area/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.service_area;
    }
});

/*
 * ABROAD.UI.Places.Middle.Pulldown
 */
if( typeof( Beauty.UI.Places.MiddleArea ) != 'function' ) {
    Beauty.UI.Places.MiddleArea = function (){};
}
Beauty.UI.Places.MiddleArea.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id         : 'bty-middle-area-sel',
            name       : 'middle_area',
            label      : '中エリア',
            has_parent : true,
            parent     : 'service_area',
            service_area : ''
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/beauty'
                + '/middle_area/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.middle_area;
    }
});

/*
 * ABROAD.UI.Places.SmallArea.Pulldown
 */
if( typeof( Beauty.UI.Places.SmallArea ) != 'function' ) {
    Beauty.UI.Places.SmallArea = function (){};
}
Beauty.UI.Places.SmallArea.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-small-area-sel',
            name        : 'small_area',
            label       : '小エリア',
            has_parent  : true,
            parent      : 'middle_area',
            middle_area : ''
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/beauty'
                + '/small_area/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.small_area;
    }
});

/*
 * Beauty.UI.HairImage.Pulldown - イメージプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-01 v1.00 released
 */
if( typeof( Beauty.UI.HairImage ) != 'function' ) {
    Beauty.UI.HairImage = function (){};
}
Beauty.UI.HairImage.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-hair-image-sel',
            name        : 'hair_image',
            label       : 'イメージ'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/beauty'
                + '/hair_image/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.hair_image;
    }
});

/*
 * Beauty.UI.HairLength.Pulldown - 髪の長さプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-01 v1.00 released
 */
if( typeof( Beauty.UI.HairLength ) != 'function' ) {
    Beauty.UI.HairLength = function (){};
}
Beauty.UI.HairLength.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-hair-length-sel',
            name        : 'hair_length',
            label       : '髪の長さ'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/beauty'
                + '/hair_length/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.hair_length;
    }
});

/*
 * Beauty.UI.HairRyou.Pulldown - 髪の量プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairRyou ) != 'function' ) {
    Beauty.UI.HairRyou = function (){};
}
Beauty.UI.HairRyou.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-ryou-sel',
            name           : 'hair_ryou',
            label          : '髪の量'
        };
    },
    get_selections: function (){
        return {
            "1": "少ない",
            "2": "普通",
            "3": "多い"
        };
    }
});

/*
 * Beauty.UI.HairShitsu.Pulldown - 髪の質プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairShitsu ) != 'function' ) {
    Beauty.UI.HairShitsu = function (){};
}
Beauty.UI.HairShitsu.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-shitsu-sel',
            name           : 'hair_shitsu',
            label          : '髪の質'
        };
    },
    get_selections: function (){
        return {
            "1": "柔かい",
            "2": "普通",
            "3": "硬い"
        };
    }
});

/*
 * Beauty.UI.HairFutosa.Pulldown - 髪の太さプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairFutosa ) != 'function' ) {
    Beauty.UI.HairFutosa = function (){};
}
Beauty.UI.HairFutosa.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-futosa-sel',
            name           : 'hair_futosa',
            label          : '髪の太さ'
        };
    },
    get_selections: function (){
        return {
            "1": "細い",
            "2": "普通",
            "3": "太い"
        };
    }
});

/*
 * Beauty.UI.HairKuse.Pulldown - 髪のクセプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairKuse ) != 'function' ) {
    Beauty.UI.HairKuse = function (){};
}
Beauty.UI.HairKuse.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-kuse-sel',
            name           : 'hair_kuse',
            label          : '髪のクセ'
        };
    },
    get_selections: function (){
        return {
            "1": "なし",
            "2": "少し",
            "3": "強い"
        };
    }
});

/*
 * Beauty.UI.HairKaogata.Pulldown - 顔型プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
if( typeof( Beauty.UI.HairKaogata ) != 'function' ) {
    Beauty.UI.HairKaogata = function (){};
}
Beauty.UI.HairKaogata.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-hair-kaogata-sel',
            name           : 'hair_kaogata',
            label          : '顔型'
        };
    },
    get_selections: function (){
        return {
            "1": "丸型",
            "2": "卵型",
            "3": "四角",
            "4": "逆三角",
            "5": "ベース"
        };
    }
});

/*
 * Beauty.UI.Order.Pulldown - 並び順プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-03 v1.00 released
 */
if( typeof( Beauty.UI.Order ) != 'function' ) {
    Beauty.UI.Order = function (){};
}
Beauty.UI.Order.Pulldown =
Class.create( Recruit.UI.Base.Pulldown, {
    _get_def_props: function (){
        return {
            id             : 'bty-order-sel',
            name           : 'order',
            label          : '並び順',
            first_opt_text : 'ランダム'
        };
    },
    get_selections: function (){
        return {
            "1": "サロン名かな順",
            "2": "小エリアコード順"
        };
    }
});

/*
 * Beauty.UI.Kodawari.Pulldown - こだわりプルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-02 v1.00 released
 */
if( typeof( Beauty.UI.Kodawari ) != 'function' ) {
    Beauty.UI.Kodawari = function (){};
}
Beauty.UI.Kodawari.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-kodawari-sel',
            name        : 'kodawari',
            label       : 'こだわり'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/beauty'
                + '/kodawari/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.kodawari;
    }
});

/*
 * Beauty.UI.KodawariSetsubi.Pulldown - こだわり設備プルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-02 v1.00 released
 */
if( typeof( Beauty.UI.KodawariSetsubi ) != 'function' ) {
    Beauty.UI.KodawariSetsubi = function (){};
}
Beauty.UI.KodawariSetsubi.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-kodawari-setsubi-sel',
            name        : 'kodawari_setsubi',
            label       : 'こだわり設備'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/beauty'
                + '/kodawari_setsubi/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.kodawari_setsubi;
    }
});

/*
 * Beauty.UI.KodawariMenu.Pulldown - こだわりメニュープルダウン
 * VERSION 1.00
 * CHANGES
 *   2008-02-02 v1.00 released
 */
if( typeof( Beauty.UI.KodawariMenu ) != 'function' ) {
    Beauty.UI.KodawariMenu = function (){};
}
Beauty.UI.KodawariMenu.Pulldown =
Class.create( Recruit.UI.Base.Pulldown.JSONP, {
    _get_def_props: function (){
        return {
            id          : 'bty-kodawari-menu-sel',
            name        : 'kodawari_menu',
            label       : 'こだわりメニュー'
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/beauty'
                + '/kodawari_menu/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.kodawari_menu;
    }
});

// end of jQuery no-conflict wrapper
})(jQuery);

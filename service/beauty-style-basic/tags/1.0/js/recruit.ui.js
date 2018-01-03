/*
 * recruit.ui.js - UI library for Recruit Web Service
 * AUTHOR: Toshimasa Ishibashi iandeth [at] gmail.com
 * VERSION: 1.00
 */

// prototype.class.min.js - for Class.create() extension
var Prototype={Version:'1.6.0',ClassVersion:'1.0.0',Browser:{IE:!!(window.attachEvent&&!window.opera),Opera:!!window.opera,WebKit:navigator.userAgent.indexOf('AppleWebKit/')>-1,Gecko:navigator.userAgent.indexOf('Gecko')>-1&&navigator.userAgent.indexOf('KHTML')==-1,MobileSafari:!!navigator.userAgent.match(/Apple.*Mobile.*Safari/)},emptyFunction:function(){},K:function(x){return x}};var Class={create:function(){var parent=null,properties=$A(arguments);if(Object.isFunction(properties[0]))parent=properties.shift();function klass(){this.initialize.apply(this,arguments)}Object.extend(klass,Class.Methods);klass.superclass=parent;klass.subclasses=[];if(parent){var subclass=function(){};subclass.prototype=parent.prototype;klass.prototype=new subclass;parent.subclasses.push(klass)}for(var i=0;i<properties.length;i++)klass.addMethods(properties[i]);if(!klass.prototype.initialize)klass.prototype.initialize=Prototype.emptyFunction;klass.prototype.constructor=klass;return klass}};Class.Methods={addMethods:function(source){var ancestor=this.superclass&&this.superclass.prototype;var properties=Object.keys(source);if(!Object.keys({toString:true}).length)properties.push("toString","valueOf");for(var i=0,length=properties.length;i<length;i++){var property=properties[i],value=source[property];if(ancestor&&Object.isFunction(value)&&value.argumentNames().first()=="$super"){var method=value,value=Object.extend((function(m){return function(){return ancestor[m].apply(this,arguments)}})(property).wrap(method),{valueOf:function(){return method},toString:function(){return method.toString()}})}this.prototype[property]=value}return this}};Object.extend=function(destination,source){for(var property in source)destination[property]=source[property];return destination};Object.extend(Object,{isFunction:function(object){return typeof object=="function"},keys:function(object){var keys=[];for(var property in object)keys.push(property);return keys}});Object.extend(Function.prototype,{argumentNames:function(){var names=this.toString().match(/^[\s\(]*function[^(]*\((.*?)\)/)[1].split(",").invoke("strip");return names.length==1&&!names[0]?[]:names},bind:function(){if(arguments.length<2&&arguments[0]===undefined)return this;var __method=this,args=$A(arguments),object=args.shift();return function(){return __method.apply(object,args.concat($A(arguments)))}},wrap:function(wrapper){var __method=this;return function(){return wrapper.apply(this,[__method.bind(this)].concat($A(arguments)))}}});Object.extend(String.prototype,{toArray:function(){return this.split('')},strip:function(){return this.replace(/^\s+/,'').replace(/\s+$/,'')}});var $break={};var Enumerable={each:function(iterator,context){var index=0;iterator=iterator.bind(context);try{this._each(function(value){iterator(value,index++)})}catch(e){if(e!=$break)throw e;}return this},invoke:function(method){var args=$A(arguments).slice(1);return this.map(function(value){return value[method].apply(value,args)})},collect:function(iterator,context){iterator=iterator?iterator.bind(context):Prototype.K;var results=[];this.each(function(value,index){results.push(iterator(value,index))});return results}};Object.extend(Enumerable,{map:Enumerable.collect});Object.extend(Array.prototype,Enumerable);Object.extend(Array.prototype,{first:function(){return this[0]},_each:function(iterator){for(var i=0,length=this.length;i<length;i++)iterator(this[i])}});function $A(iterable){if(!iterable)return[];if(iterable.toArray)return iterable.toArray();var length=iterable.length,results=new Array(length);while(length--)results[length]=iterable[length];return results}if(Prototype.Browser.Opera){Array.prototype.concat=function(){var array=[];for(var i=0,length=this.length;i<length;i++)array.push(this[i]);for(var i=0,length=arguments.length;i<length;i++){if(Object.isArray(arguments[i])){for(var j=0,arrayLength=arguments[i].length;j<arrayLength;j++)array.push(arguments[i][j])}else{array.push(arguments[i])}}return array}}

// DataPage library v0.02
// http://openjsan.org/src/b/ba/bashi/Data.Page-0.02/
if(typeof(Data)!='function'){Data=function(){}}Data.Page=function(){this.initialize.apply(this,arguments)};Data.Page.VERSION="0.02";Data.Page.prototype={initialize:function(total_entries,entries_per_page,current_page){this._total_entries=0;this._entries_per_page=10;this._current_page=1;this.total_entries(total_entries);this.entries_per_page(entries_per_page);this.current_page(current_page)},total_entries:function(int){int=parseInt(int);if(int>0){this._total_entries=int}return this._total_entries},entries_per_page:function(int){int=parseInt(int);if(int>0){this._entries_per_page=int}return this._entries_per_page},current_page:function(int){int=parseInt(int);if(int>0){this._current_page=int}return this._current_page},entries_on_this_page:function(){if(this.total_entries()==0){return 0}return this.last()-this.first()+1},first_page:function(){return 1},last_page:function(){var pages=this.total_entries()/this.entries_per_page();var last_page=1;if(pages==parseInt(pages)){last_page=pages}else{last_page=1+parseInt(pages)}if(last_page<1){last_page=1}return last_page},first:function(){if(this.total_entries()==0){return 0}return((this.current_page()-1)*this.entries_per_page())+1},last:function(){if(this.current_page()==this.last_page()){return this.total_entries()}return this.current_page()*this.entries_per_page()},previous_page:function(){if(this.current_page()>1){return this.current_page()-1}return undefined},next_page:function(){if(this.current_page()<this.last_page()){return this.current_page()+1}return undefined},splice:function(arr){var top=arr.length;if(arr.length>this.last()){top=this.last()}if(top==0){return[]}var ret=[];var from=this.first()-1;var to=top-1;for(var i=0;i<arr.length;i++){if(i<from){continue}if(i>to){break}ret.push(arr[i])}return ret},skipped:function(){var skipped=this.first()-1;if(skipped<0){return 0}return skipped}};


// everything wrapped in jQuery -
// same effect as jQuery.noConflict() for use with prototype.js
(function($){

if( typeof( Recruit ) != 'function' ) {
    Recruit = function (){};
}
if( typeof( Recruit.UI ) != 'function' ) {
    Recruit.UI = function (){};
    Recruit.UI.key = ''; // API KEY
}

/*
 * Recruit.UI.Base - UI base class
 * VERSION 1.00
 * CHANGES
 *   2007-02-04 v1.00 released
 */
Recruit.UI.Base = Class.create({
    initialize: function ( hash ){
        if( typeof hash != 'object' ){ hash = {} }
        // set properties
        var defs = this._get_def_props();
        defs = $.extend({
            id             : '',
            val            : undefined,
            name           : '',
            label          : ''
        }, defs );
        defs = $.extend( defs, hash );
        $.extend( this, defs );
        this.is_error = false;
        this.error_msg = '';
        // select elements
        this.elm = $( '#' + this.id );
        // error check
        if( this.elm.length == 0 ){
            this._set_no_elem_error();
            return;
        }
        this.reset_ui();
        // append name attribute if not set
        this._set_attr_names();
        // create pulldown - let child class do this.
        // this.update_ui( hash );
    },
    // below are override-able methods
    _set_attr_names: function (){
        // this.elm.attr( 'name', 'foo' );
    },
    update_ui: function ( hash ){
        // this.elm.html( ... );
    },
    reset_ui: function ( hash ){
        // this.elm.empty();
    },
    _set_no_elem_error: function (){
        this.error_msg = this.label 
            + 'のHTML要素が見つかりません\n'
            + 'id: ' + this.id;
        this.is_error = true;
    },
    // override-able for grand child classes
    _get_def_props: function (){
        return {
            id    : 'my-rui-elem',
            name  : 'my-rui-name',
            label : 'ベース'
        }
    },
    get_selections: function ( hash ){
        return {};
    }
});

/*
 * Recruit.UI.Base.Pulldown - base class for pulldown UI
 * VERSION 1.00
 * CHANGES
 *   2007-12-21 v1.00 released
 */
Recruit.UI.Base.Pulldown =
Class.create( Recruit.UI.Base, {
    initialize: function ( $super, hash ){
        if( typeof hash != 'object' ){ hash = {} }
        $super( hash );
        if( this.first_opt_text == undefined ){
            this.first_opt_text =
                Recruit.UI.Base.Pulldown.first_opt_text;
        }
        // create pulldown
        if( !hash.dont_update_ui ){
            this.update_ui( hash );
        }
    },
    _set_attr_names: function (){
        if( this.elm.length && !this.elm.attr( 'name' ) ){
            this.elm.attr( 'name', this.name );
        }
    },
    update_ui: function ( hash ){
        var pull = this.elm;
        var defs = this.get_selections( hash );
        this.reset_ui( hash );
        var default_val = this.val;
        var _self = this;
        $.each( defs, function ( key ){
            var val = defs[ key ];
            var opt = document.createElement( "OPTION" );
            opt.value = key;
            if( key == default_val ){
                opt.selected = true;
            }
            var label = _self._create_option_label( val );
            var txt = document.createTextNode( label );
            $( opt ).append( txt );
            pull.append( opt );
        }); 
    },
    reset_ui: function ( hash ){
        var elm = this.elm;
        if( !elm ){ return }
        elm.empty();
        elm.append( '<option value="">'
            + this.first_opt_text + '</option>' );
    },
    _create_option_label: function ( val ){
        return val;
    }
});
Recruit.UI.Base.Pulldown.first_opt_text = '指定なし';

/*
 * Recruit.UI.Base.CheckBox - base class for checkbox UI
 * VERSION 1.00
 * CHANGES
 *   2008-02-05 v1.00 released
 */
Recruit.UI.Base.CheckBox =
Class.create( Recruit.UI.Base, {
    initialize: function ( $super, hash ){
        if( typeof hash != 'object' ){ hash = {} }
        $super( hash );
        if( this.val == undefined ){
            this.val = [];
        }
        this.checkboxes = [];
        // create checkboxes
        if( !hash.dont_update_ui ){
            this.update_ui( hash );
        }
    },
    update_ui: function ( hash ){
        var elm = this.elm;
        var defs = this.get_selections( hash );
        this.reset_ui( hash );
        var def_vals = {};
        $.each( this.val, function (i,name){
            def_vals[ name ]++;
        });
        var _self = this;
        // create checkbox elements
        $.each( defs, function ( i, d ){
            var chb = $( '<input type="checkbox"/>' )
                .attr( 'name', d.name || _self.name )
                .attr( 'value', d.value || 1 );
            if( def_vals[ d.name ] ){
                chb.attr( 'checked', 'checked' );
            }
            _self.checkboxes.push( chb );
        }); 
        // create view
        $.each( this.checkboxes, function ( i, chb ){
            elm.append( chb );
            elm.append( '&nbsp;' );
        });
    },
    reset_ui: function ( hash ){
        var elm = this.elm;
        if( !elm ){ return }
        elm.empty();
        this.checkboxes = [];
    },
    get_selections: function ( hash ){
        return [
            { value: 'val1', label: 'lbl1', name: 'name1' },
            { value: 'val2', label: 'lbl2', name: 'name2' },
            { value: 'val3', label: 'lbl3', name: 'name3' }
        ];
    }
});

/*
 * Recruit.UI.Driver.JSONP - driver for JSONP requesting UI
 * VERSION 1.00
 * CHANGES
 *   2007-12-21 v1.00 released
 */
if( typeof( Recruit.UI.Driver ) != 'function' ) {
    Recruit.UI.Driver = function (){};
}
Recruit.UI.Driver.JSONP = Class.create({
    initialize: function ( hash ){
        if( typeof hash != 'object' ){ hash = {} }
        this.url = hash.url || '';
        this.prm = $.extend({
            key      : Recruit.UI.key,
            count    : 100,
            format   : 'jsonp',
            callback : '?'
        }, hash.prm );
        this.on_update_hook = hash.on_update_hook ||
            function (){};
        this.cache   = {};
        this.errstr  = '';
        this.results = {};
        if( !hash.no_api_key_alert && !this.prm.key ){
             alert( 'APIキーが未設定です。\n'
                + '変数 Recruit.UI.key にご自身のAPIキーを'
                + '指定してください' );
        }
    },
    get: function ( post_func, hash ){
        this.results = {};
        if( typeof post_func != 'function' ){
            post_func = function (){};
        }
        if( typeof hash != 'object' ){ hash = {} }
        var prm = $.extend( this.prm, hash );
        var key = this._make_cache_key( prm );
        if( !this.cache[ key ] ){
            var _self = this;
            $.getJSON( _self.url, prm, function ( json ){
                if( _self._is_ajax_error( json ) ){
                    post_func.apply( _self, [false, json, hash] );
                    _self.on_update_hook( false, json );
                    return false;
                }
                _self.cache[ key ] = json;
                _self._get_onload( json );
                post_func.apply( _self, [true, json, hash] );
                _self.on_update_hook( true, json );
            });
        }else{
            var json = this.cache[ key ];
            this._get_onload( json );
            post_func.apply( this, [true, json, hash] );
            this.on_update_hook( true, json );
        }
    },
    _get_onload: function ( json ){
        this.results = json.results;
    },
    _is_ajax_error: function ( json ){
        if( json.results.error ){
            this.errstr = json.results.error[0].message;
            this.results = undefined;
            return true;
        }
        return false;
    },
    _make_cache_key: function ( prm ){
        var str = '';
        $.each( prm, function (k,v){
            str = str + k + '=' + v + '&';
        });
        return str;
    }
});

/*
 * Recruit.UI.Base.Pulldown.JSONP - base class for pulldown UI's
 *     that retrieve selection from API request.
 * VERSION 1.00
 * CHANGES
 *   2008-01-22 v1.00 released
 */
Recruit.UI.Base.Pulldown.JSONP =
Class.create( Recruit.UI.Base.Pulldown, {
    initialize: function ( $super, hash ){
        if( typeof hash != 'object' ){ hash = {} }
        hash.dont_update_ui = true; // yield ui update
        $super( hash );
        delete this.dont_update_ui; // delete key
        this.driver = this._get_driver();
        if( typeof hash.on_update_hook == 'function' ){
            var _self = this;
            this.driver.on_update_hook = function (){
                hash.on_update_hook.apply( _self, arguments );
            };
        }
        this.update_ui( hash ); // now, do ui update
    },
    update_ui: function ( hash ){
        if( typeof hash != 'object' ){ hash = {} }
        if( typeof hash.prm != 'object' ){ hash.prm = {} }
        if( this.has_parent && !this[ this.parent ] ){
            this.reset_ui();
            this.is_error = true;
            this.error_msg = this.parent + 'が指定されていません';
            return false;
        }
        var _self = this;
        var post_func = function ( success ){
            if( !success ){ return false }
            Recruit.UI.Base.Pulldown.prototype.update_ui.apply(
                _self, arguments );
        };
        if( this.has_parent && hash.prm[ this.parent ] == undefined ){
            hash.prm[ this.parent ] = this[ this.parent ];
        }
        hash.prm = this._fix_params( hash.prm );
        this.driver.get( post_func, hash.prm );
    },
    _fix_params: function ( prm ){
        return prm;  // do whatever need with ajax parameters
    },
    // override-ables
    get_selections: function (){
        var ret = {};
        var _self = this;
        var arr = this._get_selections_material();
        $.each( arr, function (i,d){
            ret[ d.code ] = d.name;
        });
        return ret;
    },
    _get_def_props: function (){
        return {
            id         : 'rui-jsonp-sel',
            name       : 'rui-name',
            label      : '項目名',
            has_parent : false   // 連動動作系プルダウンの子なら true
        };
    },
    _get_driver: function (){
        return new Recruit.UI.Driver.JSONP({
            url : 'http://webservice.recruit.co.jp/hotpepper'
                + '/large_service_area/v1/'
        });
    },
    _get_selections_material: function (){
        return this.driver.results.large_service_area;
    }
});

/*
 * Recruit.UI.Page - auto generate helpful info for pagination
 * VERSION 1.00
 * CHANGES
 *   2007-12-21 v1.00 released
 */
Recruit.UI.Page = Class.create( new Data.Page(), {
    // had to create Data.Page instance, since Data.Page wasn't
    // defined with Class.create()
    initialize: function ( data, count ){
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
        this._response_data = data;
    },
    page_param: function ( page, hash ){
        page = parseInt( page );
        if( !page ){ return undefined }
        if( !hash ){ hash = {} }
        hash.count = this.entries_per_page();
        hash.start = ( page - 1 ) *
            this.entries_per_page() + 1;
        return hash;
    },
    next_page_param : function ( hash ){
        return this.page_param( this.next_page(), hash );
    },
    previous_page_param : function ( hash ){
        return this.page_param( this.previous_page(), hash );
    }
});


/*
 * Data.Page.Simple - auto generate pagination UI
 * VERSION 1.00
 * CHANGES
 *   2007-12-21 v1.00 released
 */
Data.Page.Simple = Class.create({
    initialize: function ( data_page ){
        if( typeof( data_page ) != 'object' ){ return undefined }
        this.bid = 'page';  // bid = appended class name prefix
        this.data_page = data_page;
    },
    paginate: function ( hash ){
        var _self = this;
        var def_request = function ( s ){
            alert( 'Data.Page.Simple.paginate()\n'
            + 'no callback function specified. start = ' + s );
        };
        // parameters
        var prm = $.extend({
            id: this.bid + '-page',
            template: '',
            template_type: 0,
            request: def_request,
            request_args: {},
            sub_uis: []
        }, hash );
        // find target element
        var uis = [
            { 
                id: prm.id,
                template: prm.template,
                template_type: prm.template_type
            }
        ];
        $.each( prm.sub_uis, function ( i, itm ){
            if( itm.id == undefined ){ return true }
            uis.push( itm ); 
        });
        // define template
        $.each( uis, function ( i, itm ){
            itm.my_tmpl = '';
            if( itm.template != undefined && itm.template != '' ){
                itm.my_tmpl = itm.template;
            }else{
                itm.my_tmpl = _self._get_template( itm.template_type, prm );
            }
            if( typeof( itm.my_tmpl ) == 'string' ){
                itm.tmpl_is = 'string';
            }else{
                itm.tmpl_is = 'jquery_object';
            }
        });
        // generate UI
        var _self = this;
        $.each( uis, function ( i, ui ){
            // validate
            var tgt = $( '#' + ui.id );
            if( tgt.length == 0 ){
                alert( 'Data.Page.Simple\n'
                + 'could not find element with id: ' + ui.id );
                return false;
            }
            tgt.empty();
            var html = ui.my_tmpl;
            // replace <#*> tags
            var res = {};
            if( ui.tmpl_is == 'string' ){
                var replace_tags = {
                    'te' : _self.data_page.total_entries(),
                    'cp' : _self.data_page.current_page(),
                    'lp' : _self.data_page.last_page(),
                    'fi' : _self.data_page.first(),
                    'li' : _self.data_page.last()
                };
                $.each( replace_tags, function ( k, v ){
                     html = html.replace( new RegExp( "<#" + k + ">", "g" ), v );
                });
                res = $( '<span class="temporary-wrapper">'
                    + html + '</span>' );
            }else{
                res = html; // already a jQuery object
            }
            // set navigation callback
            if( _self.data_page.previous_page() ){
                var prevpp = _self.data_page.previous_page_param();
                res.find( "." + _self.bid + "-page-back > a:first" )
                    .click( function (){
                        prm.request( prevpp.start, prm.request_args );
                        return false;
                    });
            }else{
                res.find( "." + _self.bid + "-page-back" ).remove(); 
            }
            if( _self.data_page.next_page() ){
                var nextpp = _self.data_page.next_page_param();
                res.find( "." + _self.bid + "-page-next > a:first" )
                    .click( function (){
                        prm.request( nextpp.start, prm.request_args );
                        return false;
                    });
            }else{
                res.find( "." + _self.bid + "-page-next" ).remove(); 
            }
            // append to target
            if( ui.tmpl_is == 'string' ){
                res.contents().appendTo( tgt );
            }else{
                res.appendTo( tgt );
            }
        });
        return true;
    },
    _get_template: function ( id, prm ){
        var b = this.bid; 
        if( id == 'no_space' ){
            var tmpl = 
                '<span class="' + b + '-page-total">'
                + '<span class="' + b + '-page-total-count"><#te></span> 件'
                + '見つかりました</span>'
                + '<span class="' + b + '-page-back"><a href="">'
                + '&lt;&lt;前へ</a></span>'
                + '<span class="' + b + '-page-info"><#cp> / <#lp> '
                + 'ページ</span>'
                + '<span class="' + b + '-page-next"><a href="">'
                + '次へ&gt;&gt;</a></span>';
            return tmpl;
        }else if( id == 'float_right' ){
            var tmpl = 
                '<div class="' + b + '-page-navi" style="float:right">'
                + '<span class="' + b + '-page-back"><a href="">'
                + '&lt;&lt;前へ</a>&nbsp;&nbsp;</span>'
                + '<span class="' + b + '-page-info"><#cp> / <#lp> '
                + 'ページ</span>'
                + '<span class="' + b + '-page-next">&nbsp;&nbsp;<a href="">'
                + '次へ&gt;&gt;</a></span>'
                + '</div>'
                + '<div class="' + b + '-page-total">'
                + '<span class="' + b + '-page-total-count"><#te></span> 件'
                + '見つかりました</div>';
            return tmpl;
        }else if( id == 'float_right_2rows' ){
            var tmpl = 
                '<div class="' + b + '-page-total">'
                + '<span class="' + b + '-page-total-count"><#te></span> 件'
                + '見つかりました</div>'
                + '<div class="' + b + '-page-navi" style="text-align:right">'
                + '<span class="' + b + '-page-back"><a href="">'
                + '&lt;&lt;前へ</a>&nbsp;&nbsp;</span>'
                + '<span class="' + b + '-page-info"><#cp> / <#lp> '
                + 'ページ</span>'
                + '<span class="' + b + '-page-next">&nbsp;&nbsp;<a href="">'
                + '次へ&gt;&gt;</a></span>'
                + '</div>';
            return tmpl;
        }else if( id == 'pulldown' ){
            var tmpl = '<select class="' + b + '-page-sel">';
            for( var i=1; i<=this.data_page.last_page(); i++ ){ 
                var pp = this.data_page.page_param( i );
                tmpl += '<option value="' + pp.start + '"';
                if( this.data_page.current_page() == i ){
                    tmpl += ' selected="selected"';
                }
                tmpl += '>' + i + ' ページ</option>';
            }
            tmpl += '</select>';
            tmpl = $( tmpl );
            tmpl.change( function (){
                prm.request( $( this ).val() , prm.request_args );
            });
            return tmpl;
        }else{
            var tmpl = 
                '<span class="' + b + '-page-total">'
                + '<span class="' + b + '-page-total-count"><#te></span> 件'
                + '見つかりました</span>&nbsp;&nbsp;&nbsp;&nbsp;'
                + '<span class="' + b + '-page-back"><a href="">'
                + '&lt;&lt;前へ</a></span>' + '&nbsp;&nbsp;'
                + '<span class="' + b + '-page-info"><#cp> / <#lp> '
                + 'ページ</span>' + '&nbsp;&nbsp;'
                + '<span class="' + b + '-page-next"><a href="">'
                + '次へ&gt;&gt;</a></span>';
            return tmpl;
        }
    }
});

/*
 * Recruit.UI.Page.Simple - auto generate pagination UI
 * VERSION 1.00
 * CHANGES
 *   2007-12-21 v1.00 released
 */
Recruit.UI.Page.Simple = Class.create( Data.Page.Simple, {
    initialize: function ( $super, data, count ){
        if( typeof( data ) != 'object' ){ return undefined }
        $super( new Recruit.UI.Page( data, count ) );
        this.bid = 'rui';
    }
});

// end of jQuery no-conflict wrapper
})(jQuery);

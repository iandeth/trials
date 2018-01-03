/*
 * jQuery 1.2.1 - New Wave Javascript
 *
 * Copyright (c) 2007 John Resig (jquery.com)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * $Date: 2007-09-16 23:42:06 -0400 (Sun, 16 Sep 2007) $
 * $Rev: 3353 $
 */
(function(){

var jQuery = window.jQuery = function(selector) {
    return this instanceof jQuery ?
        this.init(selector) : new jQuery(selector);
};

jQuery.fn = jQuery.prototype = {
    init: function ( selector ){
        if( jQuery.isFunction( selector ) ){
            return new jQuery( document )[ jQuery.fn.ready ? "ready" : "load" ]( selector );
        }
    },
    each: function( fn, args ) {
        return jQuery.each( this, fn, args );
    }
};

jQuery.extend = jQuery.fn.extend = function() {
    // copy reference to target object
    var target = arguments[0] || {}, a = 1, al = arguments.length, deep = false;
    // Handle a deep copy situation
    if ( target.constructor == Boolean ){
        deep = target;
        target = arguments[1] || {};
    }
    // extend jQuery itself if only one argument is passed
    if ( al == 1 ){
        target = this;
        a = 0;
    }
    var prop;
    for ( ; a < al; a++ )
        // Only deal with non-null/undefined values
        if ( (prop = arguments[a]) != null )
            // Extend the base object
            for ( var i in prop ) {
                // Prevent never-ending loop
                if ( target == prop[i] ){
                    continue;
                }
                // Recurse if we're merging object values
                if ( deep && typeof prop[i] == 'object' && target[i] ){
                    jQuery.extend( target[i], prop[i] );
                // Don't bring in undefined values
                }else if ( prop[i] != undefined ){
                    target[i] = prop[i];
                }
            }
    // Return the modified object
    return target;
};

var expando = "jQuery" + (new Date()).getTime(), uuid = 0, win = {};
jQuery.extend({
    jquery: "1.2.1",
    isFunction: function( fn ) {
        return !!fn && typeof fn != "string" && !fn.nodeName && 
            fn.constructor != Array && /function/i.test( fn + "" );
    },
    cache: {},
    data: function( elem, name, data ) {
        elem = elem == window ? win : elem;
        var id = elem[ expando ];
        // Compute a unique ID for the element
        if ( !id ) {
            id = elem[ expando ] = ++uuid;
        }
        // Only generate the data cache if we're
        // trying to access or manipulate it
        if ( name && !jQuery.cache[ id ] ){
            jQuery.cache[ id ] = {};
        } 
        // Prevent overriding the named cache with undefined values
        if ( data != undefined ){
            jQuery.cache[ id ][ name ] = data;
        } 
        // Return the named cache data, or the ID for the element   
        return name ? jQuery.cache[ id ][ name ] : id;
    },
    removeData: function( elem ) {
        elem = elem == window ? win : elem;
        var id = elem[ expando ];
        // Clean up the element expando
        try {
            delete elem[ expando ];
        } catch(e){
            // IE has trouble directly removing the expando
            // but it's ok with using removeAttribute
            if ( elem.removeAttribute ){
                elem.removeAttribute( expando );
            }
        }
        // Completely remove the data cache
        delete jQuery.cache[ id ];
    },
    each: function( obj, fn ) {
        if ( obj.length == undefined ){
            for ( var i in obj ){
                fn.call( obj[i], i, obj[i] );
            }
        }else{
            for ( var i = 0, ol = obj.length, val = obj[0]; 
                i < ol && fn.call(val,i,val) !== false; val = obj[++i] ){}
        }
        return obj;
    }
});

var userAgent = navigator.userAgent.toLowerCase();
// Figure out what browser is being used
jQuery.browser = {
    version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
    safari: /webkit/.test(userAgent),
    opera: /opera/.test(userAgent),
    msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
    mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
};

jQuery.event = {
    add: function(element, type, handler, data) {
        // For whatever reason, IE has trouble passing the window object
        // around, causing it to be cloned in the process
        if ( jQuery.browser.msie && element.setInterval != undefined ){
            element = window;
        }
        // Make sure that the function being executed has a unique ID
        if ( !handler.guid ){
            handler.guid = this.guid++;
        } 
        // if data is passed, bind to handler 
        if( data != undefined ) { 
            // Create temporary function pointer to original handler 
            var fn = handler; 
            // Create unique handler function, wrapped around original handler 
            handler = function() { 
                // Pass arguments and context to original handler 
                return fn.apply(this, arguments); 
            };
            // Store data in unique handler 
            handler.data = data;
            // Set the guid of unique handler to the same of original handler,
            // so it can be removed 
            handler.guid = fn.guid;
        }
        // Namespaced event handlers
        var parts = type.split(".");
        type = parts[0];
        handler.type = parts[1];
        // Init the element's event structure
        var events = jQuery.data(element, "events") || jQuery.data(element, "events", {});
        var handle = jQuery.data(element, "handle", function(){
            // returned undefined or false
            var val;
            // Handle the second event of a trigger and when
            // an event is called after a page has unloaded
            if ( typeof jQuery == "undefined" || jQuery.event.triggered ){
                return val;
            } 
            val = jQuery.event.handle.apply(element, arguments);
            return val;
        });
        // Get the current list of functions bound to this event
        var handlers = events[type];
        // Init the event handler queue
        if (!handlers) {
            handlers = events[type] = {};   
            // And bind the global event handler to the element
            if (element.addEventListener){
                element.addEventListener(type, handle, false);
            }else{
                element.attachEvent("on" + type, handle);
            }
        }
        // Add the function to the element's handler list
        handlers[handler.guid] = handler;
        // Keep track of which events have been used, for global triggering
        this.global[type] = true;
    },
    guid: 1,
    global: {},
    handle: function(event) {
        // returned undefined or false
        var val;
        // Empty object is for triggered events with no data
        event = jQuery.event.fix( event || window.event || {} ); 
        // Namespaced event handlers
        var parts = event.type.split(".");
        event.type = parts[0];
        var c = jQuery.data(this, "events") && jQuery.data(this, "events")[event.type], 
                args = Array.prototype.slice.call( arguments, 1 );
        args.unshift( event );
        for ( var j in c ) {
            // Pass in a reference to the handler function itself
            // So that we can later remove it
            args[0].handler = c[j];
            args[0].data = c[j].data;
            // Filter the functions by class
            if ( !parts[1] || c[j].type == parts[1] ) {
                var tmp = c[j].apply( this, args );
                if ( val !== false ){
                    val = tmp;
                }
                if ( tmp === false ) {
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        }
        // Clean up added properties in IE to prevent memory leak
        if (jQuery.browser.msie){
            event.target = event.preventDefault = event.stopPropagation =
                event.handler = event.data = null;
        }
        return val;
    },
    fix: function(event) {
        // store a copy of the original event object 
        // and clone to set read-only properties
        var originalEvent = event;
        event = jQuery.extend({}, originalEvent);
        // add preventDefault and stopPropagation since 
        // they will not work on the clone
        event.preventDefault = function() {
            // if preventDefault exists run it on the original event
            if (originalEvent.preventDefault){
                originalEvent.preventDefault();
            }
            // otherwise set the returnValue property of the original event to
            // false (IE)
            originalEvent.returnValue = false;
        };
        event.stopPropagation = function() {
            // if stopPropagation exists run it on the original event
            if (originalEvent.stopPropagation){
                originalEvent.stopPropagation();
            }
            // otherwise set the cancelBubble property of the original event
            // to true (IE)
            originalEvent.cancelBubble = true;
        };
        // Fix target property, if necessary
        if ( !event.target && event.srcElement ){
            event.target = event.srcElement;
        } 
        // check if target is a textnode (safari)
        if (jQuery.browser.safari && event.target.nodeType == 3){
            event.target = originalEvent.target.parentNode;
        }
        // Add relatedTarget, if necessary
        if ( !event.relatedTarget && event.fromElement ){
            event.relatedTarget = event.fromElement == event.target ?  event.toElement : event.fromElement;
        }
        return event;
    }
};

jQuery.fn.extend({
    ready: function(f) {
        bindReady();
        if ( jQuery.isReady ){
            f.apply( document, [jQuery] );
        }else{
            jQuery.readyList.push( function() { 
                return f.apply(this, [jQuery]);
            });
        }
        return this;
    }
});

jQuery.extend({
    /*
     * All the code that makes DOM Ready work nicely.
     */
    isReady: false,
    readyList: [],
    // Handle when the DOM is ready
    ready: function() {
        // Make sure that the DOM is not already loaded
        if ( !jQuery.isReady ) {
            // Remember that the DOM is ready
            jQuery.isReady = true;
            // If there are functions bound, to execute
            if ( jQuery.readyList ) {
                // Execute all of them
                jQuery.each( jQuery.readyList, function(){
                    this.apply( document );
                });
                // Reset the list of functions
                jQuery.readyList = null;
            }
            // Remove event listener to avoid memory leak
            if ( jQuery.browser.mozilla || jQuery.browser.opera ){
                document.removeEventListener( "DOMContentLoaded", jQuery.ready, false );
            }
            // Remove script element used by IE hack
            if( !window.frames.length ){
                jQuery.event.add( window, "load", function(){
                    //jQuery("#__ie_init").remove();
                    var elm = document.getElementById( '__ie_init' );
                    if( elm ){
                        jQuery.removeData( elm );
                        elm.parentNode.removeChild( elm );
                    }
                });
            }
        }
    }
});

var readyBound = false;
function bindReady(){
    if ( readyBound ) return;
    readyBound = true;
    // If Mozilla is used
    if ( jQuery.browser.mozilla || jQuery.browser.opera ){
        // Use the handy event callback
        document.addEventListener( "DOMContentLoaded", jQuery.ready, false );
    // If IE is used, use the excellent hack by Matthias Miller
    // http://www.outofhanwell.com/blog/index.php?title=the_window_onload_problem_revisited
    }else if ( jQuery.browser.msie ) {
        // Only works if you document.write() it
        document.write("<scr" + "ipt id=__ie_init defer=true " + 
            "src=//:><\/script>");
        // Use the defer script hack
        var script = document.getElementById("__ie_init");
        // script does not exist if jQuery is loaded dynamically
        if ( script ) {
            script.onreadystatechange = function() {
                if ( this.readyState != "complete" ) return;
                jQuery.ready();
            };
        }
        // Clear from memory
        script = null;
    // If Safari  is used
    } else if ( jQuery.browser.safari ){
        // Continually check to see if the document.readyState is valid
        jQuery.safariTimer = setInterval(function(){
            // loaded and complete are both valid states
            if ( document.readyState == "loaded" || 
                document.readyState == "complete" ) {
                // If either one are found, remove the timer
                clearInterval( jQuery.safariTimer );
                jQuery.safariTimer = null;
                // and execute any waiting functions
                jQuery.ready();
            }
        }, 10); 
    }
    // A fallback to window.onload, that will always work
    jQuery.event.add( window, "load", jQuery.ready );
}

})();

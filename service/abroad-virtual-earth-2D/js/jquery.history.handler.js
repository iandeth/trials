/*
 * jQuery history plugin
 *
 * Copyright (c) 2006 Taku Sano (Mikage Sawatari)
 * Licensed under the MIT License:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Modified by Lincoln Cooper to add Safari support and only call the 
 * callback once during initialization for msie when no initial hash 
 * supplied.
 */

(function($){

$.extend({
	historyCurrentHash: undefined,
	historyHandler: {},
	historyCallback: function ( hash ){
		var handler = $.historyHandler[ hash ];
		if( !handler ){
			handler = $.historyHandler[ 'default' ]
		}
		handler();
	},
	historyInit: function( default_handler ){
		var current_hash = location.hash;
		
		$.historyCurrentHash = current_hash;
		if( typeof default_handler == 'function' ){
			$.historyHandler[ 'default' ] = default_handler;
		}
		if($.browser.msie) {
			// To stop the callback firing twice during initilization if no hash present
			if ($.historyCurrentHash == '') {
			$.historyCurrentHash = '#';
		}
		
			// add hidden iframe for IE
			$("body").prepend('<iframe id="jQuery-history" style="display: none;"></iframe>');
			var ihistory = $("#jQuery-history")[0];
			var iframe = ihistory.contentWindow.document;
			iframe.open();
			iframe.close();
			iframe.location.hash = current_hash;
		}
		else if ($.browser.safari) {
			// etablish back/forward stacks
			$.historyBackStack = [];
			$.historyBackStack.length = history.length;
			$.historyForwardStack = [];
			
			$.isFirst = true;
		}
		//$.historyCallback(current_hash.replace(/^#/, ''));
		setInterval($.historyCheck, 100);
	},
	
	historyAddHistory: function(hash) {
		// This makes the looping function do something
		$.historyBackStack.push(hash);
		
		$.historyForwardStack.length = 0; // clear forwardStack (true click occured)
		this.isFirst = true;
	},
	
	historyCheck: function(){
		if($.browser.msie) {
			// On IE, check for location.hash of iframe
			var ihistory = $("#jQuery-history")[0];
			var iframe = ihistory.contentDocument || ihistory.contentWindow.document;
			var current_hash = iframe.location.hash;
			if(current_hash != $.historyCurrentHash) {
			
				location.hash = current_hash;
				$.historyCurrentHash = current_hash;
				$.historyCallback(current_hash.replace(/^#/, ''));
				
			}
		} else if ($.browser.safari) {
			if (!$.dontCheck) {
				var historyDelta = history.length - $.historyBackStack.length;
				
				if (historyDelta) { // back or forward button has been pushed
					$.isFirst = false;
					if (historyDelta < 0) { // back button has been pushed
						// move items to forward stack
						for (var i = 0; i < Math.abs(historyDelta); i++) $.historyForwardStack.unshift($.historyBackStack.pop());
					} else { // forward button has been pushed
						// move items to back stack
						for (var i = 0; i < historyDelta; i++) $.historyBackStack.push($.historyForwardStack.shift());
					}
					var cachedHash = $.historyBackStack[$.historyBackStack.length - 1];
					if (cachedHash != undefined) {
						$.historyCurrentHash = location.hash;
						$.historyCallback(cachedHash);
					}
				} else if ($.historyBackStack[$.historyBackStack.length - 1] == undefined && !$.isFirst) {
					// back button has been pushed to beginning and URL already pointed to hash (e.g. a bookmark)
					// document.URL doesn't change in Safari
					if (document.URL.indexOf('#') >= 0) {
						$.historyCallback(document.URL.split('#')[1]);
					} else {
						var current_hash = location.hash;
						$.historyCallback('');
					}
					$.isFirst = true;
				}
			}
		} else {
			// otherwise, check for location.hash
			var current_hash = location.hash;
			if(current_hash != $.historyCurrentHash) {
				$.historyCurrentHash = current_hash;
				$.historyCallback(current_hash.replace(/^#/, ''));
			}
		}
	},
	historyLoad: function(hash, func){
		var newhash;
		if( func ){
			$.historyHandler[ hash ] = func;
		}
		if ($.browser.safari) {
			newhash = hash;
		}
		else {
			newhash = '#' + hash;
			location.hash = newhash;
		}
		$.historyCurrentHash = newhash;
		if($.browser.msie) {
			var ihistory = $("#jQuery-history")[0];
			var iframe = ihistory.contentWindow.document;
			iframe.open();
			iframe.close();
			iframe.location.hash = newhash;
			$.historyCallback(hash);
		}
		else if ($.browser.safari) {
			$.dontCheck = true;
			// Manually keep track of the history values for Safari
			this.historyAddHistory(hash);
			
			// Wait a while before allowing checking so that Safari has time to update the "history" object
			// correctly (otherwise the check loop would detect a false change in hash).
			var fn = function() {$.dontCheck = false;};
			window.setTimeout(fn, 200);
			$.historyCallback(hash);
			// N.B. "location.hash=" must be the last line of code for Safari as execution stops afterwards.
			// By explicitly using the "location.hash" command (instead of using a variable set to "location.hash") the
			// URL in the browser and the "history" object are both updated correctly.
			location.hash = newhash;
		}
		else {
			$.historyCallback(hash);
		}
	}
});

})(jQuery);
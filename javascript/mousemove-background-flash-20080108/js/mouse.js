// code taken from web pages below:
// http://javascript.about.com/library/blmousepos.htm
// http://www.breakingpar.com/bkp/home.nsf/0/87256B14007C5C6A87256B4B0005BFA6
Mouse = function (){
    this.init.apply( this, arguments );
};
Mouse.prototype = {
    init : function ( prm ){
        if( prm == undefined ){ prm = {} }

        this.callback = prm.callback || undefined;
        this.mouse_x = 0;
        this.mouse_y = 0;

        var _self = this;
        if (document.layers){ // Netscape
            document.captureEvents( Event.MOUSEMOVE );
            document.onmousemove = function (e){
                _self.capture_mouse_position(e);
            }
        }else if (document.all){ // Internet Explorer
            document.onmousemove = function (e){
                _self.capture_mouse_position(e);
            }
        }else if (document.getElementById){ // Netcsape 6
            document.onmousemove = function (e){
                _self.capture_mouse_position(e);
            }
        }
    },
    capture_mouse_position : function (e){
        if (document.layers){ // Netscape
            this.mouse_x = e.pageX;
            this.mouse_y = e.pageY;
        }else if (document.all){ // Internet Explorer
            this.mouse_x = window.event.x + document.body.scrollLeft;
            this.mouse_y = window.event.y+document.body.scrollTop;
        }else if (document.getElementById){ // Netcsape 6
            this.mouse_x = e.pageX;
            this.mouse_y = e.pageY;
        }
        if( this.callback ){
            this.callback( this.mouse_x, this.mouse_y );
        }
    }
};

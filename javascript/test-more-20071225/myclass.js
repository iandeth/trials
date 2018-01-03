MyClass = function (){
    this.init.apply( this, arguments );
};
MyClass.prototype.init = function (){
    this.prop1 = 'foo';
    this.elm   = $( '#my-text' );
};
MyClass.prototype.get_prop1 = function (){
    return this.prop1;
};

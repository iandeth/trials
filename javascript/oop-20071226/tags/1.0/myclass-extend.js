function extend( s, c ){
    function f(){};
    f.prototype = s.prototype;
    c.prototype = new f();
    c.prototype.__super__ = s.prototype;
    c.prototype.__super__.initialize = s;
    c.prototype.initialize = c;
    return c;
};

// Animal - parent class
Animal = extend( Object, function ( arg ){
    if( typeof arg != 'object' ){ arg = {} }
    arg.name = arg.name || 'unknown';
    this.legs  = 4;
    this.name  = arg.name;
    this.voice = 'grunt';
});
Animal.prototype.bark = function (){
    return this.voice;
};
Animal.prototype.roar = function (){
    return 'mooo!';
};


// Dog - child class
Dog = extend( Animal, function ( arg ){
    if( typeof arg != 'object' ){ arg = {} }
    this.__super__.initialize( arg );
    this.voice = 'bow wow';
});
Dog.prototype.roar = function (){
    return 'grrr!';
};


// Chiwawa - grand child class
Chiwawa = extend( Dog, function ( arg ){
    if( typeof arg != 'object' ){ arg = {} }
    this.__super__.initialize( arg );
    this.voice = 'pow pow';
    this.fur   = 'puffy';
});
Chiwawa.prototype.tail = function (){
    return 'flick flick';
};

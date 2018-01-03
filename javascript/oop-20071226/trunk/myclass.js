// Animal - parent class
Animal = function (){
    this.init.apply( this, arguments );
};
Animal.prototype.init = function ( arg ){
    if( typeof arg != 'object' ){ arg = {} }
    arg.name = arg.name || 'unknown';
    this.legs  = 4;
    this.name  = arg.name;
    this.voice = 'grunt';
    this.roar_voice = this.roar();
};
Animal.prototype.bark = function (){
    return this.voice;
};
Animal.prototype.roar = function (){
    return 'mooo!';
};


// Dog - child class
Dog = function (){
    this.init.apply( this, arguments );
};
for ( var k in Animal.prototype ){  // extends Animal
    Dog.prototype[ k ] = Animal.prototype[ k ];
}
Dog.prototype.init = function ( arg ){
    if( typeof arg != 'object' ){ arg = {} }
    Animal.prototype.init.apply( this, arguments );
    this.voice = 'bow wow';
};
Dog.prototype.roar = function (){
    return 'grrr!';
};


// Chiwawa - grand child class
Chiwawa = function (){
    this.init.apply( this, arguments );
};
for ( var k in Dog.prototype ){  // extends Dog
    Chiwawa.prototype[ k ] = Dog.prototype[ k ];
}
Chiwawa.prototype.init = function ( arg ){
    Dog.prototype.init.apply( this, arguments );
    this.voice = 'pow pow';
    this.fur   = 'puffy';
};
Chiwawa.prototype.tail = function (){
    return 'flick flick';
};

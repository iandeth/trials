// Animal - parent class
Animal = Class.create({
    initialize: function ( arg ){
        arg = Object.extend({
            name : 'unknown'
        }, arg );
        this.legs  = 4;
        this.voice = 'grunt';
        this.name  = arg.name;
        this.roar_voice = this.roar();
    },
    bark: function (){
        return this.voice;
    },
    roar: function (){
        return 'mooo!';
    }
});

// Dog - child class
Dog = Class.create( Animal, {
    initialize: function ( $super, arg ){
        $super( arg );
        this.voice = 'bow wow';  // property override
    },
    roar: function (){  // method override
        return 'grrr!';
    }
});

// Chiwawa - grand child class
Chiwawa = Class.create( Dog, {
    initialize: function ( $super, arg ){
        $super( arg );
        this.voice = 'pow pow';
        this.fur   = 'puffy';  // child only property
    },
    tail: function (){  // child only method
        return 'flick flick';
    }
});

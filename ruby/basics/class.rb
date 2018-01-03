#!/usr/local/bin/ruby -w

# super class
class Animal
    attr_accessor :legs
    attr_reader :fur
    def initialize( name='sally', fur='fluffy' )
        @name  = name
        @fur   = fur
        @voice = 'hello'
        @legs  = get_legs()
    end
    private
    def get_legs
        return 2
    end
    public
    def bark
        puts "#{@voice} by #{@name}, with #{@legs} legs"
    end
    # class method Animal.shout
    def self.shout
        return "i'm animal!!"
    end
end

# sub class
class Dog < Animal
    def initialize ( *arg )
        super  # invoke Animal.initialize( *arg )
        @voice = 'bow wow'
    end
    private  # must say 'private' again, or will make it public
    def get_legs
        return 4
    end
end

ani = Animal.new
ani.bark
puts "#{ani.fur} fur, #{ani.legs} legs"

dog = Dog.new( 'john', 'shaggy' )
dog.bark
puts "#{dog.fur} fur"

# class method call
puts Animal.shout

# some verification methods
puts dog.kind_of?( Animal )      # true (either super or sub class of)
puts dog.is_a?( Animal )         # true (synonym for kind_of?)
puts dog.instance_of?( Animal )  # false (ani.instance_of? Animal is true) 
puts dog.respond_to?( :bark )    # true (method availability)
puts dog.class                   # Dog
puts dog.class.superclass        # Animal
puts dog.object_id               # like a memory pointer

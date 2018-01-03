#!/usr/local/bin/ruby -w

# method alias doesn't work as expected in sub classes
# it calls super class' method.

# super class
class Animal
    def initialize
        @legs = gl()
    end
    def get_legs
        return 2
    end
    def bark
        puts "has #{@legs} legs"
    end
    alias :gl get_legs
end

# sub class
class Dog < Animal
    def get_legs
        return 4
    end
end

ani = Animal.new
ani.bark

dog = Dog.new
dog.bark  # should be '4' but returns '2'

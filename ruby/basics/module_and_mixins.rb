#!/usr/local/bin/ruby -w

module Foo
    CONST1 = 'Foo const1'
    def Foo.class_method
        puts 'Foo.class_method called'
    end
    def instance_method
        puts "#{self.class} instance_method called"
    end
end

# normal usage
Foo.class_method()  # or Foo::class_method()
puts Foo::CONST1
# NG
#puts Foo.CONST1
#puts Foo.instance_method()


# or as method extention
class Animal
    include Foo
    def bark
        instance_method()
    end
end

ani = Animal.new
ani.bark()
ani.instance_method()
puts Animal::CONST1

# NG
#Animal.class_method()
#ani.class_method()


# a way of bringing instance method to class(module) method
# method is copied, not aliased.
module Buz
    def instance_method
        puts "#{self.class} instance_method called"
    end
    module_function :instance_method
end
Buz.instance_method()

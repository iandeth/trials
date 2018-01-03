## Adding extended instance method to
## existing Class
String.class_exec do     # or class_eval
    puts "#{self.class} - #{self.inspect}"
    attr_accessor :foo
    def bar(val="")
        @foo ||= "default"
        puts "#{@foo}, #{val}"
    end
end

str = "あいう"
str.foo = "か"   # new property
str.bar "えお"   # new method


## Adding extended class method to
## existing Class
String.instance_exec do     # or instance_eval
    puts "#{self.class} - #{self.inspect}"
    def new_class_method(val="")
        puts "cmeth - #{val}"
    end
end

String.new_class_method "さっし"


##
## Wrapping existing method
String.instance_exec do
    org_meth = instance_method(:to_s)
    define_method(:to_s) do |*args, &block|
        puts "#{self.class} - #{self.inspect}"
        puts "==> to_s wrapped"
        #puts "==> calling #{method} with #{args.inspect}"
        return org_meth.bind(self).call(*args, &block)
    end
end

"foo".to_s


##
## Wrapping existing method - another way
module Kernel
    old_system_method = instance_method(:system)
    define_method(:system) do |*args|
        result = old_system_method.bind(self).call(*args)
        puts "system(#{args.join(', ')}) returned #{result.inspect}"
        result
    end
end
system("date")
system("pwd")

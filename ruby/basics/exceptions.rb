#!/usr/local/bin/ruby -w

# with begin blocks
begin
    raise '1: oops!'  # throw exception
    puts "1: i'm ignored"
rescue 
    puts $!  # '1: oops!'
else
    puts '1: no exception'  # called if no raise
ensure
    puts '1: wrap up'  # always executed
end


# with Exception class specified
# see ProgrammingRuby 2nd edit, p.131 for a list
# of available Exception classes
begin
    raise StandardError, '2: standard!'
rescue StandardError
    puts $!  # '2: standard!'
rescue IOError => e
    puts e.backtrace  # e is IOError instance
end


# can use rescue in method definition
def Foo
    raise '3: error!'
    puts "3: i'm ignored"
rescue
    puts $!
end
Foo()  # '3: error!'


# can be used after a single statement
exp = /^bar$/
bar = Integer( exp ) rescue String( exp )
puts "4: #{bar}"  # "(?:-mix)^bar$"


# retry
i = 0
begin
    raise '5: error!' if i == 0
    puts '5: ok'
rescue
    i += 1
    retry  # '5: ok'
end


# catch and throw
# useful for exiting from loop operation
buz = catch :found do
    (1 .. 5).each do |i|
        throw( :found, i ) if i == 3
    end
end
puts "6: caught #{buz}"  # 3

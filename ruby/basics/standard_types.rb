#!/usr/local/bin/ruby -w

# String
v  = 12
$V = 99
puts "foo bar #{v}"
puts "foo bar #$V"       # omit braces
puts %Q|foo "bar" #{v}|
puts %|foo "bar" #{v}|   # omit Q
puts %q|foo "bar" #{v}|  # q == single quote

puts <<EOS   # here docs
foo
bar
EOS

puts <<-EOS
    foo
    bar
    EOS

# Array
p [ 'a', 'b', v ]
p %W|a b #{v}|
p %w|a b #{v}|  # w == single quote


# Hash
p h = { :foo=>1, :bar=>2 }
p h = { foo:1, bar:2 }  # as of Ruby 1.9

h = Hash.new(0)  # with value default of 0
h[:foo] += 1     # else die with nil + 1
p h


# closures
proc1 = Proc.new {|a=0, *b|
    puts a + v.to_s
    p b
}

proc2 = lambda do |a=0, *b|
    puts a + v.to_s
    p b
end

proc3 = -> a=0, *b {   # as of Ruby 1.9
    puts a + v.to_s
    p b
}

proc1.call "foo", "bar", "baz"
proc2.call "foo", "bar", "baz"
proc3.call "foo", "bar", "baz"

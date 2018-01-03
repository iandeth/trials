#!/usr/local/bin/ruby

def with_defaults ( x=11, y=22 )
    puts '# with_defaults'
    puts "x: #{x}, y: #{y}"
end

def hash_args ( hash )
    puts '# hash_args'
    p hash
end

def wildcard ( *arg )
    puts '# wildcard'
    p arg
end

def hash_with_defaults ( hash )
    hash = {
        :x => 11,
        :y => 22,
        :z => 33,
    }.merge hash
    puts '# hash_with_defaults'
    p hash
end

def recieve_wild_hash( hash )
    puts '# recieve wild'
    p hash
end

with_defaults 1, 2
hash_args :x=>1, :y=>2
wildcard  :x=>1, :y=>2
hash_with_defaults :x=>1

h = {:x=>3, :y=>4}
hash_args h

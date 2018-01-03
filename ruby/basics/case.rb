#!/usr/local/bin/ruby -w

animal = 'dog'
case animal
when 'cat' : puts 'mew'
when 'bird': puts 'tweet'
when 'dog' : puts 'bow'
else puts 'huh?'
end


case animal
when 'cat'
    puts 'mew'
when 'dog'
    puts 'bow'
else
    puts 'huh?'
end


voice = case animal
        when 'cat': 'mew'
        when 'dog': 'bow'
        else 'huh?'
        end
puts voice

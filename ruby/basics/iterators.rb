#!/usr/local/bin/ruby -w

3.times do |i|
    puts "times #{i}"
end


0.upto( 2 ) do |i|
    puts "upto #{i}"
end


0.step( 9, 3 ) do |i|
    puts "step #{i}"
end


%w/a b c/.each do |i|
    puts "%w #{i}"
end

('a' .. 'c').each do |i|
    puts "( .. ) #{i}"
end

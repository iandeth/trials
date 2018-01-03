#!/usr/local/bin/ruby -w
tmpfile = 'file.txt'

# writing
# 'w' for >, 'a' for >>
File.open( tmpfile, 'w' ) do |file|
    ('a' .. 'd').each do |itm|
        file.puts 'is ' + itm
    end
end


# fail safe
begin
    file1 = File.open tmpfile, 'r'
    while line1 = file1.gets
        puts 'fs: ' + line1
    end
rescue
    puts 'error: ' + $!
ensure
    file1.close unless file1.nil?
end


# short way
File.open( tmpfile, 'r' ) do |file|
    while line = file.gets
        puts 'sw: ' + line
    end
end


# more short way
IO.foreach( tmpfile ) do |line|
    #puts 'msw: ' + line
    puts "msw: #{line.dump}"   # can see "\n" literaly
end


# read into string
str = IO.read tmpfile
puts str.length


# read into an array
arr = IO.readlines tmpfile
puts arr.length


END {
    File.delete( tmpfile ) if File.exist? tmpfile
}


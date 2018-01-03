#!/usr/local/bin/ruby -w
# encoding: utf-8

mv = "あいう"
puts "#{mv} is #{mv.encoding}"

# converting
mv_eucjp = mv.encode "euc-jp"
puts "mv_eucjp is #{mv_eucjp.encoding}"

# hex representation
puts "Greek pi: \u03c0"
puts "Greek pi: \u{3c0}"

# as bytes array
p "\u03c0".bytes.to_a

# handle as plain binary
av = "あいう"
av = av.force_encoding "ascii-8bit"
puts "av is #{av.encoding}, size #{av.size}"

# like Perl's Encode::from_to
# av = av.encode "utf-8", "sjis"
# puts "av is #{av.encoding}"

# File I/O
f = File.open("/etc/passwd", "r:ascii:utf-8")  # from:to (:binary for bin mode)
puts "File encoding is #{f.external_encoding}"
line = f.gets
puts "Data encoding is #{line.encoding}"

# check default (in|ex)ternal encoding
puts "Default internal encoding is: #{Encoding.default_internal}"
puts "Default external encoding is: #{Encoding.default_external}"

# if all your files are written with ISO-8859-1 encoding
# but you want your program to have to deal with their
# content as if it were UTF-8, you can use this:
#
# $ ruby -E iso-8859-1:utf-8
#

# You can specify just an internal encoding by omitting the external
# option but leaving the colon:
#
# $ ruby -E :utf-8
#
# Or if with UTF-8, just -U will do:
#
# $ ruby -U

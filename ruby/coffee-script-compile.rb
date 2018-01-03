#!ruby
require 'coffee-script'

## https://github.com/josh/ruby-coffee-script
puts CoffeeScript.compile File.read(ARGV[0])

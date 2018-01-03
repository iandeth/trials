require 'open-uri'

open( 'http://pragprog.com' ) do |file|
    puts file.read.scan(/<img alt=".*?" src="(.*?)"/m)
end

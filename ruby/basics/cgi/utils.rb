#!/usr/local/bin/ruby -w
require 'cgi'

# URL encode/decode
esc = CGI.escape( 'a&b&c' )
puts CGI.unescape( esc )

# HTML escape
esch = CGI.escapeHTML( '<div>hoge</div>' )
puts CGI.unescapeHTML( esch )

# HTML escape - selective
esce = CGI.escapeElement( '<div><span>hoge</span></div>', 'span' )
puts CGI.unescapeElement( esce, 'span' )


# RFC DateTime
puts CGI.rfc1123_date( Time.now )


# QUERY_STRING
cgi = CGI.new
p cgi.keys
# [ 'foo', 'bar' ]
p cgi.params
# {
#   'key1' => [ 'value' ], 
#   'key2' => [ 'val1', 'val2' ],
# }


# assuming QUERY_STRING of 'foo=1&foo=2&bar=3'
# cgi.params[ 'foo' ] = [ "1", "2" ]
# cgi[ 'foo' ] = "1"
p cgi.params[ 'foo' ]
p cgi[ 'foo' ]
puts cgi.has_key?( 'bar' )

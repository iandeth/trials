#!/usr/local/bin/ruby -w

# something like perl's $FindBin::Bin
# use lib "$FindBin::Bin/lib"
$:.unshift File.join( File.dirname( __FILE__ ), "lib" )

# or in pickel axe book way:
$: << File.join( File.dirname(__FILE__), "lib" );

## Ruby 1.9: rather use require_relative, instead.
# require_relative "lib/some-module"

#!/usr/local/bin/ruby -w
require 'test/unit'

# class to be tested
class Animal
    attr :name
    def initialize ( name='sally' )
        @name  = name
        @voice = 'hello'
    end
    def bark
        return @voice
    end
end

# test class for Animal
class TestAnimal < Test::Unit::TestCase
    def setup
        @ani = Animal.new
    end
    def teardown
        # wrap up codes
    end
    def test_initialize
        assert @ani
        assert_equal( 'sally', @ani.name )
        assert_match( /^\w+$/, @ani.name )
    end
    def test_bark
        assert_equal( 'hello', @ani.bark )
    end
end


# running just one selected test case:
# $ ruby tc_anima.rb --name test_bark


# something like perl's Test::Harness
# where ./test is test code and ./lib is your classes
#
#   $:.unshift File.join( File.dirname( __FILE__ ), "..", "lib" )
#   require 'test/unit'
#   require 'tc_animal'
#   require 'tc_dog'
#
# prefix 'tc' meaning test case, and you should name this 
# harness file 'ts_myproj' meaning test suite

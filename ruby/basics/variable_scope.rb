#!/usr/local/bin/ruby -w

# blocks make lexical scopes
block = proc do
    foo = 1
    puts defined? foo  # local-variable(in block)
end
block.call
puts defined? foo  # nil


# but when there's a lvalue substituion, plus same
# variable in outer scope, that'll be used instead
# of creating local ones
bar = 'bar'
block = proc do
    bar = 'bar updated'
end
block.call
puts bar  # 'bar updated'


# same with argument variables
baz = 'baz'
block = proc do |baz|  # baz = 'baz as argument' happens here
    puts baz  # 'baz as argument'
end
block.call( 'baz as argument' )
puts baz  # baz as argument


# use next to return a value and exit from block
block = proc do
    next 99
end
puts block.call  # 99


# if called as yield, break in a block returns
# the caller function.
def qux ( &block )
    yield
    return 'qux: post proc'
end
ret = qux do
    break 'qux: proc break'
end
puts ret  # 'qux: proc break'


# but this won't work, since there is no caller method,
# and not an yield call.
def quux
    block = proc do
        break 'quux: proc break'
    end
    block.call
    return 'quux: post proc'
end
puts quux  # 'quux: post proc'


# a return inside the block acts as return from the scope.
# scope in this case, is foobar.
def foobar
    (1..10).each do |val|
        return val # returns from method
    end
end
puts foobar  # 1


# with Proc.new, return will cause LocalJumpError
# if used in a wrong situation.
#block = Proc.new do
#    return 'return Proc.new'
#end
#block.call  # LocalJumpError exception

# but not with proc and lambda
# -- with Ruby 1.9.2, proc also raise LocalJumError
block = proc do
    return 'return proc'
end
puts block.call  # 'return proc'

block = lambda do
    return 'return lambda'
end
puts block.call  # 'return lambda'


# passing proc to method yield's
block = proc do |i|
    puts i
end
(1 .. 3).each &block  # 1 2 3

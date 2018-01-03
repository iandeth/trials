## http://coffeescript.org/

## perl's $speed ||= 75
speed ?= 75
console.log speed


## ruby's foo.nil?
foo = 0
console.log 'foo defined' if foo?


## php's in_array
foo = 2
console.log 'in array' if foo in [1, 2, 3]


## interpolation
foo = 'foo'
console.log "hello #{foo}"


## return collection with iterators
arr = (num for num in [4..1])
console.log arr


## avoid referencing last assigned value in loop closures
items = ['foo', 'bar', 'baz']
## bad sample:
##   box = []
##   for v in items
##     box.push () -> console.log v
##   f() for f in box
## result: baz, baz, baz
##
## the solution, wrap with do()
box = []
for v in items
  do (v) ->
    box.push () -> console.log v
f() for f in box
## result: foo, bar, buz


## safe accessor
## won't throw TypeError at all
zip = lottery?.drawWinner?().address?.zipcode


## assign arrays to lvalue (destructive assignment)
weatherReport = (location) ->
  return [location, 72, "Sunny"]
[city, temp, forecast] = weatherReport "Berkeley"
console.log "#{city}, #{temp}, #{forecast}"


## function argument splats (take all the rest)
f = (foo, bar, buz...) ->
  console.log buz
f 1, 2, 3, 4, 5   # buz = 3, 4, 5
## can be put in middle
f = (foo, bar..., buz) ->
  console.log bar
f 1, 2, 3, 4, 5   # bar = 2, 3, 4


## function binding, same as:
##   var _this = this; 
##   $('.foo').click(function(){
##     _this.bar;
##   });
class Account
  constructor: (@customer) ->
  pay: () ->
    console.log "outer: #{@customer}"
    do () ->
      console.log "inner1: #{@customer}"   # undef
    do () =>
      console.log "inner2: #{@customer}"   # _this.customer
## and execute
account = new Account 'bob'
account.pay()


## switch/case
day = "Mon"
bingoDay = "Sat"
go = (task) -> console.log "goto #{task}"
switch day
  when "Mon" then go "work"
  when "Tue" then go "relax"
  when "Thu" then go "iceFishing"
  when "Fri", "Sat"
    if day is bingoDay
      go "bingo"
      go "dancing"
  when "Sun" then go "church"
  else go "work"


## chained comparisons
cholesterol = 127
healthy = 200 > cholesterol > 60
console.log "healthy? #{healthy}"


## multiline strings
mobyDick = "Call me Ishmael. Some years ago --
 never mind how long precisely -- having little
 or no money in my purse, and nothing particular
 to interest me on shore, I thought I would sail
 about a little and see the watery part of the
 world..."
console.log mobyDick


## heredoc
foo = 2
html = """
       <strong>
         #{foo} cups of coffeescript
       </strong>
       """
console.log html


## comment block pass-through
## below (with three #s)  will be converted to 
## JS comments upon compilation.
###
CoffeeScript Compiler v1.2.0
Released under the MIT License
###


## extended regexp (like perl's m//x)
regexp = ///
  <(\w+)          # tag name
  \s+([^/>]+)\s*  # attributes
  (?:/)?>         # close tag
///
res = '<img src="foo"/>'.match regexp
console.log res[1], res[2]

## jQuery
$ ->
  $('.preview').click ->
    alert 'preview'


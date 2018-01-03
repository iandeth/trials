class Animal
  constructor: (h={}) ->
    @name = h.name || 'Jolly'
    @legs = 2
  move: (meters) ->
    console.log "#{@name} moved #{meters}m."
  walk: () ->
    console.log "walk with #{@legs} legs."
  ## static method
  bark: (voice="anima---l") ->
    console.log voice
  ## static properties
  @group: 'mammals'

class Snake extends Animal
  constructor: (h={}) ->
    super h
    @legs = 0
  move: ->
    console.log "Slithering..."
    super 5
  @group: 'reptiles'

class Horse extends Animal
  constructor: (h={}) ->
    super h
    @legs = 4
  move: ->
    console.log "Galloping..."
    super 45
  ## super with static method
  bark: ->
    super "veee--e"
  mooove: ->
    ## calling instance method
    console.log "# mooove"
    @move()  # or
    this.move()

## main
sam = new Snake
tom = new Horse name:"Tommy"
sam.move()
tom.move()
sam.walk()
tom.walk()
tom.mooove()

## static methods
Snake::bark()
Horse::bark()

## static properties
console.log Snake.group

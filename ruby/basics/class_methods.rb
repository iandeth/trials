class Animal
  @voice = 'animal!'    # like class constant
  def self.bark
    puts @voice
  end
end

class Animal::Dog < Animal
  @voice = 'bark!'
end

Animal.bark       # animal!
Animal::Dog.bark  # bark!

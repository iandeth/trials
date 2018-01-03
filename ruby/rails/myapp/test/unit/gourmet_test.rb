require 'test_helper'

class GourmetTest < ActiveSupport::TestCase
  test "genres and areas are hashes" do
    g = gourmets(:burger)
    assert_equal({fastfood:1, western:1}, g.genres)
    assert_equal({1=>1, 3=>1}, g.areas)
  end

  test "create new record" do
    genres = {fastfood:1, chinese:1}
    areas = {1=>1}
    g = Gourmet.create({
      name: 'foo',
      genres: genres,
      areas: areas
    })
    g.reload
    assert_equal genres, g.genres
    assert_equal areas, g.areas
  end
end

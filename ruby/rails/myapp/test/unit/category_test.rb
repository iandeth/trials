# encoding: utf-8
require 'test_helper'

class CategoryTest < ActiveSupport::TestCase
  test "has three seeds" do
    assert_equal 3, Category.count

    ## select with order
    rows = Category.order('id desc').all

    ## output to log/test.log
    #Rails::logger.debug rows.to_yaml

    assert_equal 3, rows.size
    assert_equal 'Ruby', rows.first.name
  end

  test "has attributes" do
    row = Category.find 1
    expected = categories :php
    assert_equal expected, row
  end

  test "call helper" do
    #=> test/test_helper.rb
    assert_equal 'wee', my_method('wee')
  end

  test "has many assoc" do
    row = Category.find 1
    ps = row.posts.select('id, title').order('title desc')

    ## output to STDOUT with config/environments/test.rb trick
    #Rails::logger.info ps.to_yaml

    assert_equal 2, ps.size, 2   # 以下２つは alias method
    assert_equal 2, ps.count, 2
    assert_equal 2, ps.length, 2
    assert_equal posts(:three).id, ps[0].id
    assert_equal posts(:two).id, ps[1].id
  end

  test "validation basics" do
    row = Category.new(name:nil, sort_order:1)
    assert_equal false, row.valid?, 'runs validation and return boolean'
    assert_instance_of Array, row.errors[:name]  #=>["can't be blank"]
    assert_match %r/blank/, row.errors[:name][0]
    assert_equal [], row.errors[:sort_order], 'has no error'
    assert_equal false, row.errors[:sort_order].any?, 'has no error, elegant way'
    #Rails::logger.info(row.errors.inspect)
  end

  test "save basics" do
    assert_equal 3, Category.count

    row = Category.new(name:nil, sort_order:1)
    assert_equal false, row.save, 'returns false on error'
    assert row.errors[:name].any?
    assert_equal 3, Category.count, 'db unchanged'

    row = Category.new(name:'foo', sort_order:1)
    assert_equal true, row.new_record?, 'marked not saved yet'
    assert_equal true, row.save
    assert_equal false, row.new_record?
    assert_equal 4, Category.count, 'db changed'
  end

  test "update basics" do
    row = Category.find(1)
    assert_equal 'PHP', row.name
    assert_equal 1, row.sort_order

    row.name = 'foo'
    row.sort_order = 2
    assert row.save

    row.reload  #=> fetch fresh db data
    assert_equal 'foo', row.name
    assert_equal 2, row.sort_order
  end

  test "update_attributes" do
    row = Category.find(1)

    ## this will update name, and unwillingly
    ## sort_order too.
    row.sort_order = 3
    row.update_attributes(name:'bar')

    row.reload
    assert_equal 'bar', row.name
    assert_equal 3, row.sort_order, 'oops, updated'

    ## validation will run too
    assert_equal true, row.valid?
    row.update_attributes(name:nil)
    assert_equal false, row.valid?
  end

  test "saving has_many association models" do
    row = Category.find(1)
    assert_equal 2, row.posts.count

    ## add new post on existing category
    newpost = Post.new(title:'foo', user_id:1, category_id:1)
    row.posts << newpost   # array push == db insert
    row.reload
    assert_equal 3, row.posts.count

    ## saving new category and posts at same time
    assert_equal 3, Category.count
    assert_equal 5, Post.count
    newc = Category.new(name:'caca', sort_order:4)
    newp1 = Post.new(title:'p1', user_id:2)  #=> without category_id
    newp2 = Post.new(title:'p2', user_id:1)
    newc.posts = [newp1, newp2]
    assert_equal 3, Category.count, 'insert not happend yet'
    assert_equal 5, Post.count

    assert newc.save
    assert_equal 4, Category.count
    assert_equal 7, Post.count, 'all posts are saved too'
  end
end

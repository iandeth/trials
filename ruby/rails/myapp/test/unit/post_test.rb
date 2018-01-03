# encoding: utf-8
require 'test_helper'

class PostTest < ActiveSupport::TestCase
  test "using scope" do
    posts = Post.for_php.all
    assert_equal 2, posts.size
  end

  test "using includes" do
    ## includes prefetches association records
    ## with minimum SQL execution (via WHERE IN)
    posts = Post.includes(:category).all

    ## すると category プロパティ呼び出した際に SQL 叩かない
    assert_equal 'Perl', posts.first.category.name

    ## でも単一レコード find の際は select join じゃなくて
    ## select posts, select categories の２発になる。若干非効率。
    post = Post.includes(:category).find(2)
    assert_equal 'PHP', post.category.name
  end

  test "using join" do
    ## 単一レコード + join column １つ２つなら join
    ## 使うと SQL 1 発で済む
    post = Post.joins(:category).select(
      'posts.*, categories.name as category_name'
    ).find(2)
    assert_equal 'ポスト２', post.title
    assert_equal 'PHP', post.category_name
  end

  test "validation basics" do
    ## with DB column default value set,
    ## default value will be autoset upon new
    post = Post.new(title:'foo', user_id:1)  #=> blank category_id
    assert post.valid?
  end

  test "habtm tags read" do
    post = Post.includes(:tags).find(1)
    assert_equal 'Green', post.tags[0].name
    assert_equal 'Red', post.tags[1].name
    # TODO: sort order is wrong
  end

  test "habtm tags crud" do
    ## create new post
    post = Post.new(title:'foo', user_id:2)
    post.tags = [ tags(:red), tags(:green) ]
    assert_equal 'Red', post.tags[0].name
    assert_equal 'Green', post.tags[1].name
    assert post.save

    post.reload
    assert_equal 'Green', post.tags[0].name
    assert_equal 'Red', post.tags[1].name
    # TODO: sort order has changed. why?

    ## add tag
    post.tags << tags(:white)
    post.reload
    assert_equal 3, post.tags.count
    #=> post.save is not needed

    ## delete tags
    assert_equal 3, post.tags.count
    post.tags = [ post.tags[1] ]
    assert_equal 1, post.tags.count
    #=> post.tags.shift will not trigger delete sql
    #=> post.save is not needed
  end

  test "has_many_through labels read" do
    post = Post.includes(:labels).find(1)
    assert_equal 2, post.labels.count
    assert_equal 'Poor', post.labels[0].name
    assert_equal 'Good', post.labels[1].name
    assert_equal 2, post.post_labels.count
    assert_equal 'メモ２', post.post_labels[0].memo
    assert_equal 'メモ１', post.post_labels[1].memo
  end

  test "has_many_through labels create" do
    ## create new post - type1: ラベルを直接 push
    post = Post.new(title:'foo', user_id:2)
    post.labels = [ labels(:good), labels(:poor) ]
    assert_equal 'Good', post.labels[0].name
    assert_equal 'Poor', post.labels[1].name
    assert_equal 0, post.post_labels.count, '中間テーブルのレコードはメモリ生成されない'
    assert post.save
    post.reload
    assert_equal 'Good', post.labels[0].name
    assert_equal 'Poor', post.labels[1].name
    assert_equal 2, post.post_labels.count, 'reload すれば OK'

    ## create new post - type2: PostLabel をメモ付きで追加
    post = Post.new(title:'bar', user_id:1)
    post.post_labels << PostLabel.new(label_id:labels(:better).id, memo:'memoo1')
    post.post_labels << PostLabel.new(label_id:labels(:worst).id, memo:'memoo2')
    assert_equal 'memoo1', post.post_labels[0].memo
    assert_equal 'memoo2', post.post_labels[1].memo
    assert_equal 0, post.labels.count, 'ラベルテーブルのレコードはメモリ生成されない'
    assert post.save
    post.reload
    assert_equal 'memoo1', post.post_labels[0].memo
    assert_equal 'memoo2', post.post_labels[1].memo
    assert_equal 'Better', post.labels[0].name, 'reload すれば OK'
    assert_equal 'Worst', post.labels[1].name
  end

  test "has_many_through labels update" do
    post = Post.includes(:labels).find(1)
    assert_equal 2, post.labels.size, 'array.length なので SQL は実行されない'
    assert_equal 2, post.labels.length, 'array.length なので SQL は実行されない'
    assert_equal 2, post.labels.count, 'SELECT COUNT(*) が実行される'

    ## add post_label
    post.post_labels << PostLabel.new(label_id:labels(:better).id, memo:'memoo1')
    assert_equal 3, post.post_labels.count
    assert_equal 3, post.post_labels.size, 'メモリ上も増えてる'
    assert_equal 3, post.labels.count
    assert_equal 2, post.labels.size, 'メモリ上はまだ２つだけ'
    post.reload

    ## add label directly
    post.labels << labels(:worst)
    assert_equal 4, post.labels.count
    assert_equal 4, post.labels.size, 'メモリ上も増えてる'
    assert_equal 4, post.post_labels.count
    assert_equal 4, post.post_labels.size, 'これだと post_label もメモリ上に増えてる'
    post.post_labels[3].memo = 'あらたなメモ'
    assert post.post_labels[3].save, 'メモを更新する場合は手動で save 実施必要'
  end

  test "has_many_through labels assoc validation" do
    post = Post.new(title:'foo', user_id:1)
    post.post_labels << PostLabel.new(label_id:labels(:better).id, memo:'poo')
    assert !post.valid?, 'エラーになる'
    assert post.errors[:post_labels].any?
  end
end

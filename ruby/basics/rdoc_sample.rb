## このファイル先頭部分は rdoc_sample.rb ファイルに対する rdoc 記述扱いになる。
require 'sqlite3'

# ここから class 定義に対する rdoc 記述扱い。
#
# Implements a simple accumulator, whose value is accessed via the attribute
# _counter_. Calling the method Counter#inc increments this value.
# 
#--
# TODO: this block will be ignored
# by -- mark.
#++
# ここからコメント復活。with #++ mark.
#
# == フォントスタイル
#
# <em>This is in italic font</em>
#
# <b>This is in BOLD font</b>
# 
# <tt>This is in typewriter font</tt>
#
# == リンク
#
# 外のサイトへのリンク: http://rdoc.sourceforge.net
#
# ネット上の画像へのリンク: http://rdoc.sourceforge.net/images/rdoc.gif
#
# 他の gem や module へのリンク - クラスメソッド: Counter::new
#
# 他の gem や module へのリンク - インスタンスメソッド: Counter#inc
#
# == リスト
#
# <b>リスト (bullet型)</b>
# * その１、あーだこーだ
#   あいうえお。かきく。
# * その２、これでもないあれでもない
# * その３、やったねこれ。
# ---
# <b>リスト (number型)</b>
# 1. あーだこーだ
#    あいうえお。かきく。
# 2. これでもないあれでもない
# 3. やったねこれ。
# ---
# <b>リスト (dictionary型)</b>
# [あーだ] あいうえお。(日本語 key で value を複数行が出来ない！left indention 数え方が間違ってる模様)
# [これで] もないよな。そうでもない。
# [<em>Foo</em>] key をイタリックにもできるよ
# ---
# <b>リスト (dictionary型)(この書き方だと日本語で複数行も OK)</b>
# [あーだ]
#     あいうえお。
#     かきくけこ、これならいいのね。
# [これで]
#     もないよな。そうでもない。
# [<em>Foo</em>]
#     key をイタリックにもできるよ
# ---
# <b>リスト (dictionary型 type2)</b>
# あーだ:: あいうえお。(日本語 key で value を複数行が出来ない！left indention 数え方が間違ってる模様)
# これで:: もないよな。そうでもない。
# <em>Foo</em>:: key をイタリックにもできるよ

class Counter
    # The current value of the count
    attr_reader :counter

    # create a new Counter with the given
    # initial value
    def initialize( initial_value=0 )
        @counter = initial_value
    end

    # increment the current value of the count
    def inc
        @counter += 1
    end

    # yield を中で使ってるメソッドは別途 yield 用の引数コメントを書ける
    # NOT WORKING: ruby 1.9.2 では機能してないっぽい
    def fred   # :yields: index, position
        line, address = ( 2, 'foo' )
        yield line, address
    end

    private
    def some_private_method
        @counter += 10
    end

    # private method を doc に載せたい場合
    # NOT WORKING: ruby 1.9.2 では基本的に private method は全部乗る模様？
    def some_other_private_method   # :doc:
        @counter += 20
    end
end

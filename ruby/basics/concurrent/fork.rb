#!ruby
require "json"
## 参考
## http://www.ruby-doc.org/core-1.9.3/Process.html

## process 間で共通変数への書き込みが出来ない事を試す為の hash
h = { p:1 }

## ３つの子供プロセスを立ち上げる
(1..3).each do |i|
  ## fork ブロックの中が各子供プロセスで実行される
  Process.fork {
    # ランダム秒数待ってみる
    sec = Random.new.rand 5
    sleep sec
    # 共通変数に書き込んでみる
    h["c#{i}".to_sym] = 1
    # 画面に状況を表示
    puts "child #{i} (#{sec}sec) #{JSON.dump h}"
  }
end

## 子供達が全員終わるのを待つように指示
Process.waitall

## 親プロセスから見た共通変数はどうなってるか
puts "parent end #{JSON.dump h}"

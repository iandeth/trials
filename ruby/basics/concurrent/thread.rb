#!ruby
require "json"
## 参考
## https://blog.engineyard.com/2011/a-modern-guide-to-threads
## http://www.ruby-doc.org/core-1.9.3/Thread.html

## thread 間で共通変数への書き込みが可能な事を試す為の hash
h = { p:1 }

## thread instance を保持しておく
ts = []

## 複数 thread からの共通変数書き込みの交通整理を
## する為の secure lock ツール => mutex
mtx = Mutex.new

## ３つの thread を立ち上げる
(1..3).each do |i|
  ## do block の中が別 thread にて並列処理される
  ts << Thread.new do
    # ランダム秒数待ってみる
    sec = Random.new.rand 5
    sleep sec
    # 共通変数に書き込んでみる
    mtx.synchronize do
      h["c#{i}".to_sym] = 1
    end
    # 画面に状況を表示
    puts "child #{i} (#{sec}sec) #{JSON.dump h}"
  end
end

## thread 達が全員終わるのを待つように指示
ts.each do |t|
  t.join
end

## 親プロセスから見た共通変数はどうなってるか
puts "parent end #{JSON.dump h}"

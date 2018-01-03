#
# クラス変数は、親クラス・子クラスで共有するゆえ、
# 子クラス側で宣言し直すと、親クラス側にも影響する
#
class Top
    @@A = "top A"
    @@B = "top B"
    def dump
        puts values
    end
    def values
        "#{self.class.name}: @@A = #@@A, @@B = #@@B"
    end
end

class MiddleOne < Top
    @@B = "One B"
    @@C = "One C"
    def values
        super + ", C = #@@C"
    end
end

class MiddleTwo < Top
    @@B = "Two B"
    @@C = "Two C"
    def values
        super + ", C = #@@C"
    end
end

class BottomOne < MiddleOne; end
class BottomTwo < MiddleTwo; end

Top.new.dump         # @@A = top A, @@B = Two B  --> あれれ？
MiddleOne.new.dump   # @@A = top A, @@B = Two B, C = One C
MiddleTwo.new.dump   # @@A = top A, @@B = Two B, C = Two C
BottomOne.new.dump   # @@A = top A, @@B = Two B, C = One C
BottomTwo.new.dump   # @@A = top A, @@B = Two B, C = Two C


#
# Ruby のクラス変数はサブクラスやスーパークラスでも共有される例2
# 
class Hoge
    def bar=(i)
        @@bar = i
    end
    def bar
        @@bar
    end
end

class Fuga < Hoge
end

hoge = Hoge.new
hoge.bar = 1
hoge.bar # => 1

fuga = Fuga.new
fuga.bar # => 1
fuga.bar = 2
fuga.bar # => 2
hoge.bar # => 2  --> あれれ？

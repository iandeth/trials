#!ruby

# http://www.gakuto.co.jp/w/suugaku/su_daizai03-2.htm
module Math
  def self.fib(i=10)
    x=1; y=1
    r = [x, y]
    (i - r.size).times do
      t = x + y
      r.push t
      (x, y) = [y, t]
    end
    r
  end
end

p Math.fib()

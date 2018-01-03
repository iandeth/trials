# via https://kaizen.qiita.com/ku0522a/items/6d95f9588af6255efcbb
class TenKeys
  def initialize(cols=3, keys=nil)
    keys ||= %w/1 2 3 4 5 6 7 8 9 * 0 #/
    @keys = keys.map {|k| k.to_s }
    @cols = cols
    @rows = build_rows(keys, cols)
  end

  def shift_x(n)
    return unless n > 0
    @rows.each do |row|
      row.rotate!(-n)
    end
  end

  def shift_y(n)
    return unless n > 0
    @rows.rotate!(-n)
  end

  def shift_linear(n)
    keys = @rows.flatten
    keys.rotate!(-n)
    @rows = build_rows(keys, @cols)
  end

  private
  def build_rows(keys, cols)
    rows = []
    rows_cnt = keys.size / cols
    rows_cnt += 1 if keys.size % cols > 0
    rows_cnt.times do |i|
      rows << keys.slice(cols * i, cols)
    end
    rows
  end

  def to_s
    max_w = @keys.map {|k| k.length }.max
    fmt = "%#{max_w}s"  #= sprintf format
    strs = []
    @rows.each do |row|
      strs << row.map {|r| sprintf(fmt, r) }.join(' | ')
    end
    return strs.join("\n")
  end
end

# main
tk = TenKeys.new
tk.shift_x(2)
puts tk, "\n"
tk.shift_y(3)
puts tk, "\n"

# 4 cols
tk = TenKeys.new(4)
puts tk, "\n"
tk.shift_x(1)
puts tk, "\n"
tk.shift_y(2)
puts tk, "\n"

# 1 to 100, 10 cols
tk = TenKeys.new(10, (1 .. 100).to_a)
puts tk, "\n"
tk.shift_x(5)
tk.shift_y(5)
puts tk, "\n"

tk = TenKeys.new(5, ("A" .. "Y").to_a)
puts tk, "\n"
tk.shift_x(4)
tk.shift_y(2)
puts tk, "\n"

names = %w/bob tom mike sam kate jeff liv larz kirk/.sort
tk = TenKeys.new(3, names)
puts tk, "\n"
tk.shift_x(2)
tk.shift_y(2)
puts tk, "\n"

tk = TenKeys.new
puts tk, "\n"
tk.shift_linear(2)
puts tk, "\n"

class TenKeys
  def initialize(cols=3, keys=nil)
    keys ||= %w/1 2 3 4 5 6 7 8 9 * 0 #/
    @keys = keys.map {|k| k.to_s }
    @cols = cols
    @max_key_str_width = @keys.map {|k| k.length }.max
  end

  def shift_xy(x,y)
    rows = build_rows
    rows = shift_x(x, rows) if x > 0
    rows = shift_y(y, rows) if y > 0
    render(rows)
  end

  private
  def shift_x(n, rows)
    shift = n % @cols
    new_rows = []
    rows.each do |row|
      popped = row.pop(shift)
      row = popped + row
      new_rows << row
    end
    new_rows
  end

  def shift_y(n, rows)
    shift = n % rows.size
    popped = rows.pop(shift)
    rows = popped + rows
  end

  def build_rows
    rows = []
    rows_cnt = @keys.size / @cols
    rows_cnt += 1 if @keys.size % @cols > 0
    rows_cnt.times do |i|
      rows << @keys.slice(@cols * i, @cols)
    end
    rows
  end

  def render(rows)
    fmt = "%#{@max_key_str_width}s"  #= sprintf format
    rows.each do |row|
      puts row.map {|r| sprintf(fmt, r) }.join(' | ')
    end
    print "\n"
  end
end

# main
tk = TenKeys.new
tk.shift_xy(2, 0)
tk.shift_xy(0, 3)
tk.shift_xy(2, 3)

# 4 cols
tk = TenKeys.new(4)
tk.shift_xy(0, 0)
tk.shift_xy(1, 0)
tk.shift_xy(0, 2)

# 1 to 100, 10 cols
tk = TenKeys.new(10, (1 .. 100).to_a)
tk.shift_xy(0, 0)
tk.shift_xy(5, 5)

tk = TenKeys.new(5, ("A" .. "Y").to_a)
tk.shift_xy(0, 0)
tk.shift_xy(4, 2)

names = %w/bob tom mike sam kate jeff liv larz kirk/.sort
tk = TenKeys.new(3, names)
tk.shift_xy(0, 0)
tk.shift_xy(2, 0)

class Holder
    @@var = 99
    def self.var=(val)
        @@var = val
    end
    def var
        @@var
    end
end

@@var = "top level variable"
a = Holder.new
puts a.var   # => "top level variable" あれれ？
Holder.var = 123
puts a.var   # => 123

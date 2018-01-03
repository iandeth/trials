require 'pp'

kdef = %w/foo bar baz/
dat  = { 'baz'=>3, 'foo'=>1, 'bar'=>2 }

ret = dat.values_at( *kdef )
pp ret

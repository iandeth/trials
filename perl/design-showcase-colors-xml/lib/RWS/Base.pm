package RWS::Base;
use strict;

sub new {
    my $class = shift;
    return bless {}, $class;
}

1;

package App::Base;
use strict;

sub new {
    my $class = shift;
    my $p = {
        cgi   => undef,  # isa CGI
        ses   => undef,  # isa CGI::Sesion
        fb    => undef,  # isa Tools::Facebook
        @_,
    };
    my $self = bless $p, $class;
    return $self;
}

1;


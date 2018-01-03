package DBIx::Class::Component::MyComp;
use base qw/DBIx::Class/;
use strict;

sub add_columns {
    my $self = shift;
    warn "hello\n";
    return $self->next::method( @_ );
}

1;

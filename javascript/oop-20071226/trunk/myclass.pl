#!/usr/bin/perl -w
use strict;

package Animal;
sub new {
    my $class = shift;
    my $self = bless {}, $class;
    $self->{voice} = 'grunt';
    $self->{roar_voice} = $self->roar();
    return $self;
};
sub roar {
    return 'mooo!';
}

package Dog;
our @ISA = qw/Animal/;
sub new {
    my $class = shift;
    my $parent = $class->SUPER::new( @_ );
    my $self = bless $parent, $class;
    $self->{voice} = 'bow wow';
    return $self;
}
sub roar {
    return 'grrrr!';
}

package main;
my $dog = Dog->new();
print $dog->{roar_voice} . "\n";

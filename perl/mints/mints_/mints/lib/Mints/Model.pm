package Mints::Model;
use strict;
use Carp ();
our $VERSION = '0.01';

sub new {
	my $class = shift;
	my $valiError = shift;
	my $p = bless({},$class);
	$p->{error} = $valiError if($valiError);
	return $p;
}

sub handler {
	my $self = shift;
	my $ctrl = shift;
	return 1;
}

1;
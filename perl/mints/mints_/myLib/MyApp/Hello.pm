package MyApp::Hello;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$self->{text} = 'Hello World!';
	return 1;
}

1;
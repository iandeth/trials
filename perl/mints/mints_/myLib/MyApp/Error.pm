package MyApp::Error;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	return 1;
}

1;
package Mints::Controller::Properties::Constants;
use base Mints::Controller::Properties;
use strict;
our $VERSION = '0.01';

sub config {
	my $class = shift;
	return {
		lockHash => 1,
	};
}

1;
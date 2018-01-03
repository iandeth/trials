package Mints::Controller::DBI::Driver;
use strict;
our $VERSION = '0.01';

sub new {
	my $class = shift;
	return bless({},$class);
}

sub initialize {
	my $self = shift;
	my $ctrl = shift;
	my $dbh  = shift;
	#
	# do initialization stuff here
	#
	return 1;
}

1;
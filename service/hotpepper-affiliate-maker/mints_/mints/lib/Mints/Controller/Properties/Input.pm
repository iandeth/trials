package Mints::Controller::Properties::Input;
use base Mints::Controller::Properties;
use strict;
our $VERSION = '0.01';

sub config {
	my $class = shift;
	return {};
}

# param method, like CGI.pm
sub param {
	my $self = shift;
	my $key  = shift;
	return $self->{$key} if(exists($self->{$key}));
}

1;
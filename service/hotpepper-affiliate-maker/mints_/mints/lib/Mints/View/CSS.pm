package Mints::View::CSS;
use base Mints::View;
use strict;
our $VERSION = '0.01';

sub processHeader {
	my $self = shift;
	my $ctrl = shift;
	print $self->getContentType($ctrl,'text/css');
	return 1;
}

1;
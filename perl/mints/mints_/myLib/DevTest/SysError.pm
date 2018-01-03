package DevTest::SysError;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$ctrl->{adm}{debug} = 0;
	$ctrl->setError('error desu');
}

1;
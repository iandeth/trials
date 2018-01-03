package DevTest::NoTmpl;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$ctrl->{adm}{debug} = 2;
	$ctrl->setTemplate('Test.tmpl');
}

1;
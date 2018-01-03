package DevTest::Cookie::Global;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$ctrl->setCookie(name=>'global',value=>'全体用');
	$ctrl->setCookie(name=>'local', value=>'さあどうなる？');
}

1;
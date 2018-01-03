package DevTest::Cookie::Local;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$ctrl->{adm}{debug} = 2;
	$ctrl->setCookie(name=>'local',value=>'アプリ用',expires=>'+3M',-path=>$ctrl->{adm}{urlApp});
}

1;
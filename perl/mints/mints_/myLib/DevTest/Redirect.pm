package DevTest::Redirect;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	#$ctrl->redirect('http://www.yahoo.co.jp');
	$ctrl->setCookie(name=>'redirect', value=>'hoge');
	$ctrl->redirect('Input');
}

1;
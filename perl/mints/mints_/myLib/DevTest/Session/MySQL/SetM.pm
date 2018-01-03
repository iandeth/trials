package DevTest::Session::MySQL::SetM;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$ctrl->{ssn}{hoge} = '資料';
	$ctrl->{ssn}{fuga} = [qw(a b 日本語)];
}

1;
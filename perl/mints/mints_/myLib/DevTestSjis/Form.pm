package DevTestSjis::Form;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$self->{hoge} = '変数表示';
	if(!defined( $ctrl->{in}{tenpu} )){
		$self->{text1} = '日本語表示';
		$self->{check1} = [qw(a b)];
		$ctrl->fillInFormWith($self);
	}
}

1;
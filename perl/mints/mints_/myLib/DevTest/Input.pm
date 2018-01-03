package DevTest::Input;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$ctrl->{adm}{debug} = 1;
	if(!defined( $ctrl->{in}{tenpu} )){
		$self->{text1} = 'jojo';
		$self->{check1} = [qw(a b)];
		$ctrl->fillInFormWith($self);
	}
	# DateTime Tool
	my $tool = $ctrl->grabTool('DateTime');
	$self->{now} = $tool->sysDateTime;
	$self->{calendar} = $tool->calendar('200605');
}

1;
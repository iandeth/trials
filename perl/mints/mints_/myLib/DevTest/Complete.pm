package DevTest::Complete;
use base DevTest::Input;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	if($ctrl->{in}{back}){
		$ctrl->fillInFormWith($ctrl->{in});
		$ctrl->redispatch('Input');
	}
}

1;
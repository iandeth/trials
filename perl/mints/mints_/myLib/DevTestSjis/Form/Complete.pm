package DevTestSjis::Form::Complete;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	if($ctrl->{in}{back}){
		$ctrl->fillInFormWith($ctrl->{in});
		$ctrl->redispatch('Form');
	}
}

1;
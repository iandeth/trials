package MyApp::Toi::Complete;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	if($ctrl->{in}{back}){
		$ctrl->redispatch('Toi');
		$ctrl->fillInFormWith($ctrl->{in});
		return undef;
	}
	### send mail
	$ctrl->sendMail(
		to      => $ctrl->{con}{mail}{to},
		from    => $ctrl->{con}{mail}{from},
		subject => $ctrl->{con}{mail}{subject},
	);
}

1;
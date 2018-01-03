package Blog::Entry;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$ctrl->fillInFormWith($ctrl->{in}) if($ctrl->{in}{back});
	return 1;
}

1;

package DevTestSjis::Form::Confirm;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	opendir(my $d, $ctrl->{adm}{uploadDir});
	while (my $f = readdir($d)){
		push(@{ $self->{file} },$f);
	}
}

1;
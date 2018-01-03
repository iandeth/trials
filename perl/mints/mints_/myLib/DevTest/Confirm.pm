package DevTest::Confirm;
use base DevTest::Input;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	#if(!$ctrl->{in}{text2}){
	#	$ctrl->redispatch('Input');
	#	$self->{error_msg} = 'gagaga';
	#	return undef;
	#}
	opendir(my $d, $ctrl->{adm}{uploadDir});
	while (my $f = readdir($d)){
		push(@{ $self->{file} },$f);
	}
}

1;
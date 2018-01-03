package DevTest::Session::File::Show;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$self->{a} = 1;
	require Apache::Session::File;
	my $id = $ctrl->{in}{id};
	($id) = ($id =~ /(.+)/);
	tie %{ $self->{s} }, 'Apache::Session::File', $id, {
		Directory => $ctrl->{adm}{datDir}.'/_session',
		LockDirectory => $ctrl->{adm}{datDir}.'/_session/lock',
	};
}

1;
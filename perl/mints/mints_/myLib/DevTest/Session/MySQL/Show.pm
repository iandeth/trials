package DevTest::Session::MySQL::Show;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$self->{a} = 1;
	require Apache::Session::MySQL;
	my $dbh = $ctrl->connectDB;
	tie %{ $self->{s} }, 'Apache::Session::MySQL', $ctrl->{in}{id}, {
		Handle     => $dbh,
		LockHandle => $dbh
	};
}

1;
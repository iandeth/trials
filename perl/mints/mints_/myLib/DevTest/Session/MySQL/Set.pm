package DevTest::Session::MySQL::Set;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$self->{a} = 1;
	require Apache::Session::MySQL;
	my $dbh = $ctrl->connectDB;
	tie %{ $self->{s} }, 'Apache::Session::MySQL', undef, {
		Handle     => $dbh,
		LockHandle => $dbh
	};
	$self->{s}{hoge} = '資料';
	$self->{s}{fuga} = [qw(a b 日本語)];
	$self->{id} = $self->{s}{_session_id};
}

1;
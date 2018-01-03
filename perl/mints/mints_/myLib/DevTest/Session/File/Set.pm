package DevTest::Session::File::Set;
use base DevTest::Input;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$self->{a} = 1;
	require Apache::Session::File;
	tie my %hoge, 'Apache::Session::File', undef, {
		Directory => $ctrl->{adm}{datDir}.'/_session',
		LockDirectory => $ctrl->{adm}{datDir}.'/_session/lock',
	};
	$self->{s} = \%hoge;
	$self->{i} = 'hoge';
	$self->{s}{hoge} = '資料';
	$self->{s}{fuga} = [qw(a b 日本語)];
	$self->{id} = $self->{s}{_session_id};
}

1;
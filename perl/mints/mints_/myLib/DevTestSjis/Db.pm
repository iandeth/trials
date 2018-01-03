package DevTestSjis::Db;
use base Mints::Model;
use strict;
sub handler {
	my $self = shift;
	my $ctrl = shift;
	#$ctrl->{adm}{execEnv} = 'web';
	my $dbh = $ctrl->connectDB;
	my $sth = $dbh->prepare('SELECT * FROM test WHERE id = ?');
	$sth->execute(3);
	$self->{ret} = $sth->fetchrow_hashref;
}

1;
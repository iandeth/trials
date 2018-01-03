package DevTest::Test::Db;
use base Mints::Model;
use strict;
sub handler {
	my $self = shift;
	my $ctrl = shift;
	warn 'hoge';
	my $dbh = $ctrl->connectDB;
	my $dbh2 = $ctrl->connectDB;
	my $sth = $dbh->prepare('SELECT * FROM test WHERE value like ?');
	$sth->execute("%日本語%");
#	my $sth = $dbh->prepare('SELECT * FROM test WHERE value in(?,?,?,?)');
#	$sth->execute("%日本語%","ながいながい表示資料なんです","ながいながい表示資料なんです","ながいながい表示資料なんです");
	$self->{ret} = $sth->fetchrow_hashref;
	$self->{utf} = utf8::is_utf8($self->{ret}{value});
	$self->{info} = $dbh->{'mysql_info'};
	$self->{info_server} = $dbh->{'mysql_serverinfo'};
}

1;
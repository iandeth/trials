package Mints::Controller::DBI::Driver::mysql;
use base Mints::Controller::DBI::Driver;
use strict;
our $VERSION = '0.03';

sub initialize {
	my $self = shift;
	my $ctrl = shift;
	my $dbh  = shift;
	# define mysql server version
	my ($version) = ($dbh->{mysql_serverinfo} =~ /^([\d.]+)/);
	# translate encoding
	if($version gt '4.1'){
		$self->setNames($ctrl,$dbh);
	}
	return 1;
}

sub setNames {
	my $self = shift;
	my $ctrl = shift;
	my $dbh  = shift;
	my $codeEnc = $ctrl->getConfig->{codeEncoding};
	my $enc = $ctrl->getLocaleSetting->forMySQL->{ $codeEnc };
	$dbh->do("SET NAMES $enc");
	return 1;
}

1;
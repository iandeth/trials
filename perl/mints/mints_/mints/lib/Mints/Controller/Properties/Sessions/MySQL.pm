package Mints::Controller::Properties::Sessions::MySQL;
use base Mints::Controller::Properties::Sessions;
use Apache::Session::MySQL;
use strict;
our $VERSION = '0.02';

sub loadSession {
	my $class = shift;
	my $sid   = shift;
	my $ctrl  = shift;
	# load session
	my %s;
	eval {
		my $dbh = $ctrl->connectDB;
		tie %s, 'Apache::Session::MySQL', $sid, {
			Handle     => $dbh,
			LockHandle => $dbh
		};
	};
	if($@){
		$class->_onLoadFailure($ctrl,$sid);
		return {};
	}
	return \%s;
}

1;
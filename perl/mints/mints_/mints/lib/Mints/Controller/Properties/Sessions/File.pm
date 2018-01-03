package Mints::Controller::Properties::Sessions::File;
use base Mints::Controller::Properties::Sessions;
use Apache::Session::File;
use strict;
our $VERSION = '0.02';

sub loadSession {
	my $class = shift;
	my $sid   = shift;
	my $ctrl  = shift;
	# write out directories
	my $dir = $ctrl->{adm}{datDir}.'/_session';
	my $dirLock = $ctrl->{adm}{datDir}.'/_session/lock';
	# existance check
	$ctrl->setError("sessions: you'll need make session directory - $dir") if(!-e $dir);
	# writeability check
	$ctrl->setError("sessions: doesn't have write permission ($dir)") if(!-w $dir);
	return undef if($ctrl->hasError);
	# make lock dir if needed
	mkdir($dirLock) unless(-d $dirLock);
	# load session
	my %s;
	eval {
		tie %s, 'Apache::Session::File', $sid, {
			Directory => $dir,
			LockDirectory => $dirLock,
		};
	};
	if($@){
		$class->_onLoadFailure($ctrl,$sid);
		return {};
	}
	return \%s;
}

1;
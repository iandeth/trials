package Mints::Controller::Properties::Admin;
use base Mints::Controller::Properties;
use strict;
our $VERSION = '0.04';

sub properties {
	my $class  = shift;
	my $extras = shift;
	my ($ymd,$hms,$tt) = $class->_datetime;
	my ($appName) = ($extras->{appDir} =~ m|.+/(.+)|);
	my $p = {
		execEnv        => $extras->{execEnv} || 'term',
		appName        => $appName,
		appDir         => $extras->{appDir} || '.',
		pid            => $$,
		nowYmd         => $ymd,
		nowHms         => $hms,
		now            => $tt,
		runMode        => $extras->{runMode}, # dispatch to run
		uploadFiles    => [],    # files uploaded from browser-form
		# override-ables (with config method)
		ioEncoding     => 'utf8',
		codeEncoding   => 'utf8',
		localeModule   => 'Mints::Controller::Locale::JP',
		debug          => 0,
		# override-ables / directories below are auto-defined later in controller
		datDir         => undef,
		debugFile      => undef,
		uploadDir      => undef,
	};
	return $p;
}

sub moveAwayNonAdmins {
	my $self = shift;
	my $ctrl = shift;
	delete $self->{defaultRunMode};
	delete $self->{viewModule};
	delete $self->{urlSrc};
	delete $self->{maxUploadSize};
	delete $self->{errorTemplate};
	delete $self->{codeEncoding};
	delete $self->{ioEncoding};
	delete $self->{templateExtension};
	return 1;
}

sub _datetime {
	my $class = shift;
	my($sec,$min,$hour,$day,$mon,$year) = localtime(time);
	$mon++;
	$year += 1900;
	$day = sprintf('%02d',$day);
	$mon = sprintf('%02d',$mon);
	$year = sprintf('%04d',$year);
	$sec = sprintf('%02d',$sec);
	$min = sprintf('%02d',$min);
	$hour = sprintf('%02d',$hour);
	return ("$year$mon$day","$hour$min$sec",
	"$hour:$min:$sec $day/$mon/$year");
}

1;
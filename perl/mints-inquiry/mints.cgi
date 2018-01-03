#!/usr/bin/perl -Tw
use strict;
use FindBin;
our $VERSION = '0.02';
our $cfg;
our $baseDir;
BEGIN {
	$cfg = {
		defaultAppName => 'MyApp',
		hideAppNameFromUrl => 1,
		baseDir => undef, # specify your custom source directory path here;
	};
	# untaint
	($FindBin::RealScript) = ($FindBin::RealScript =~ /(.+)/);
	($FindBin::RealBin) = ($FindBin::RealBin =~ /(.+)/);
	# auto-resolve source directory path (if not defined)
	# with mints.cgi, source dir will be 'mints_'
	$baseDir = $cfg->{baseDir};
	if(!$baseDir){
		my ($cgiName) = ($FindBin::RealScript =~ /([^.]+)/);
		$baseDir = "$FindBin::RealBin/${cgiName}_";
	}
	# change work directory
	# work around for use lib '../relative/path' + symbolic linked .cgi
	chdir($FindBin::RealBin);
}
use lib "$baseDir/cpanLib";   # CPAN modules
use lib "$baseDir/mints/lib"; # framework specific modules
use lib "$baseDir/myLib";     # app specific modules
use Mints;
Mints->new(
	baseDir            => $baseDir,
	defaultAppName     => $cfg->{defaultAppName},
	hideAppNameFromUrl => $cfg->{hideAppNameFromUrl},
)->run;

package Mints;
use strict;
our $VERSION = '0.14';

sub new {
	my $class = shift;
	my $p = {
		baseDir => '.',
		defaultAppName     => undef,
		hideAppNameFromUrl => undef,
		@_,
	};
	return bless($p,$class);
}

sub run {
	my $self = shift;
	my %o = (
		appDir => undef,
		datDir => undef,
		@_,
	);
	# define execution environment
	my $execEnv = ($::ENV{DOCUMENT_ROOT})? 'web' : 'term';
	# resolve path info
	my($appName, $runMode) = $self->_resolvePathInfo($execEnv);
	# load controller module
	my $req = "$appName.pm";
	my $mod = "$appName";
	eval { require "$appName.pm" };
	if ($@){
		print "Content-Type: text/html\n\n" if($execEnv eq 'web');
		print $@;
		return undef;
	}
	# resolve appDir from controller module location
	my $appDir = $o{appDir} || $self->_resolveAppDir($req);
	# resolve datDir
	my $datDir = $o{datDir} || $self->_resolveDatDir($appName);
	# create controller + execute
	my $ctrl = $mod->new(
		appDir  => $appDir,
		datDir  => $datDir,
		runMode => $runMode,
		execEnv => $execEnv,
		mintsInstance => $self,
	);
	$ctrl->run;
	return $ctrl;
}

sub _resolvePathInfo {
	my $self = shift;
	my $execEnv = shift;
	my $pathInfo;
	if($execEnv eq 'web'){ $pathInfo = $::ENV{PATH_INFO}   }
	else                 { $pathInfo = shift @::ARGV || '' }
	$pathInfo =~ s{^/|/$}{}g;
	my ($appName,$runMode);
	if($self->{hideAppNameFromUrl}){
		$runMode = $pathInfo;
	}else{
		($appName,$runMode) = ($pathInfo =~ m|^([^/]+)/?(.+)?|);
	}
	# set default if not defined in url path
	$appName = $self->{defaultAppName} if(!$appName);
	die "Mints - couldn't resolve application name" unless($appName);
	# make first letter uppercase
	$appName = ucfirst $appName;
	my @tmp = split(/\//,$runMode ||= '');
	foreach (@tmp){ $_ = ucfirst($_) }
	$runMode = join('/',@tmp);
	# error if still undefined
	if(!$appName){
		if($execEnv eq 'web'){
			require CGI::Carp;
			CGI::Carp->import('fatalsToBrowser');
		}
		die 'mints: could not resolve application name';
	}
	return ($appName,$runMode);
}

sub _resolveAppDir {
	my $self = shift;
	my $appName = shift;
	my $path = $::INC{ $appName };
	my ($appDir) = ($path =~ m|(.+)\.pm|);
	$appDir = '.' unless($appDir);
	return $appDir;
}

sub _resolveDatDir {
	my $self = shift;
	my $appName = shift;
	my $datDir = $self->{baseDir}."/myDat/$appName";
	return $datDir;
}

1;

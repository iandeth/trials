package Mints::Controller::Properties::Sessions;
use base Mints::Controller::Properties;
use strict;
our $VERSION = '0.02';

sub properties {
	my $class  = shift;
	my $extras = shift;
	my $ctrl = $extras; # ugly style argument passing ;P
	my $config = $ctrl->sessionConfig;
	
	# untaint
	my $sid_name = "mints-sid-$ctrl->{adm}{appName}";
	my $sid;
	if($ctrl->{cky}{$sid_name}){
		($sid) = ($ctrl->{cky}{$sid_name} =~ /(.+)/);
	}
	
	my $s = $class->loadSession($sid,$ctrl);
	$ctrl->{adm}{sessionModule} = $config->{module};
	$ctrl->{adm}{sessionId} = $s->{_session_id};
	$ctrl->setCookie(
		name => $sid_name,
		value => $s->{_session_id},
		expires => $config->{expires} || undef,
		path    => $config->{path} || $ctrl->{adm}{urlCgi},
	);
	$s->{_session_count}++; # forces save file
	return $s;
}

sub _onLoadFailure {
	my $class = shift;
	my ($ctrl,$sid) = @_;
	$ctrl->setError("server session deleted : please try again from the beginning");
	$ctrl->setCookie(name=>'sessionId', value=>'', expires=>'-1M');
	return 1;
}

1;
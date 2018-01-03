package Mints::Controller::Properties::Sessions;
use base Mints::Controller::Properties;
use strict;
our $VERSION = '0.06';

sub properties {
	my $class  = shift;
	my $extras = shift;
	my $ctrl = $extras; # ugly style argument passing ;P
	my $config = $ctrl->sessionConfig;
	
	# untaint
	my $sid_name = "mints_sid";
	my $sid;
	if($ctrl->{cky}{$sid_name}){
		($sid) = ($ctrl->{cky}{$sid_name} =~ /(.+)/);
	}
	
	my $s = $class->loadSession($sid,$ctrl);
	$ctrl->{adm}{sessionId} = $s->{_session_id};
	if($ctrl->{adm}{execEnv} eq 'web'){
		my $path = ($ctrl->{mints}{hideAppNameFromUrl}) ?
			$ctrl->{env}{SCRIPT_NAME}
			: "$ctrl->{env}{SCRIPT_NAME}/". lcfirst($ctrl->{adm}{appName});
		$ctrl->setCookie(
			name => $sid_name,
			value => $s->{_session_id},
			expires => $config->{expires} || undef,
			path    => $config->{path} || $path,
		);
	}
	$s->{_session_count}++; # forces save file
	return $s;
}

sub _onLoadFailure {
	my $class = shift;
	my ($ctrl,$sid) = @_;
	my $sid_name = "mints_sid";
	$ctrl->setError("server session deleted : please try again from the beginning");
	$ctrl->setCookie(name=>$sid_name, value=>'', expires=>'-1M');
	return 1;
}

1;
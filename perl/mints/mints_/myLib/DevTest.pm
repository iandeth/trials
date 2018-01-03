package DevTest;
use base Mints::Controller;
use strict;

sub config {
	return {
		defaultRunMode => 'Input',
		viewModule     => 'Mints::View::HTML',
		urlSrc         => '',
		debug          => 1,
		maxUploadSize  => 10000,
		errorTemplate  => 'error.tmpl',
	};
}

sub dbConfig {
	return {
		driver   => 'mysql',
		database => 'mints',
		host     => 'localhost',
		user     => 'webadm',
		passwd   => 'mints!',
	};
}

sub sessionConfig {
	return {
		module  => 'Mints::Controller::Properties::Sessions::File',
		expires => '',
		path    => '',
	};
}

sub constants {
	return {
		logPath => '/path/to/log',
	};
}

sub runChains {
	my $self = shift;
	return [
		'parseParam',
		'parseCookies',
		'loadSession',
		'resolveRunMode',
		'setViewModule',
		'authorize', # DevTest added
		'dispatch',
	];
}

sub authorize {
	my $self = shift;
	$self->{adm}{auth} = 1;
	return 1;
}

1;
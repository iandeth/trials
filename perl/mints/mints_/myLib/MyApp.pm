package MyApp;
use base Mints::Controller;
use strict;

sub config {
	return {
		defaultRunMode => 'Hello',
		viewModule     => 'Mints::View::HTML',
		debug          => 1,
		maxUploadSize  => 10000,
		errorTemplate  => 'Error.tmpl',
	};
}

sub dbConfig {
	return {
		driver   => 'mysql',
		database => '',
		host     => 'localhost',
		user     => '',
		passwd   => '',
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

1;
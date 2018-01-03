package DevTestSjis;
use base Mints::Controller;
use strict;

sub config {
	return {
		defaultRunMode => 'Basic',
		viewModule     => 'Mints::View::HTML',
		urlSrc         => '',
		debug          => 1,
		maxUploadSize  => 10000,
		ioEncoding     => 'shiftjis',
		#errorTemplate  => 'error.tmpl',
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

1;
package Blog;
use base Mints::Controller;
use strict;

sub config {
	return {
		defaultRunMode => 'Entry',
		viewModule     => 'Mints::View::HTML',
		debug          => 0,
		maxUploadSize  => 1000,
		errorTemplate  => 'Error.tmpl',
	};
}

sub constants {
	return {};
}

1;
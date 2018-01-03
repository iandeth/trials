package MyApp;
use base Mints::Controller;
use strict;

sub config {
	return {
		defaultRunMode => 'Toi',
		viewModule     => 'Mints::View::HTML',
		debug          => 0,
		maxUploadSize  => 10000,
		errorTemplate  => 'Error.tmpl',
		umask          => 0002,
	};
}

sub constants {
	return {
		mail => {
			to      => q(hino@r.recruit.co.jp),
			from    => q("問い合わせフォーム" <info@example.com>),
			subject => q(問い合わせがありました),
		},
	};
}
1;
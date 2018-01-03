package MyApp::Toi::ConfirmVali;
use base Mints::Model::Validation;
use strict;

sub initOption {
	my $class = shift;
	my $ctrl  = shift;
	return {
		runModeOnError => 'Toi',
		returnErrorAs  => 'string',
		fillInFormWith => $ctrl->{in},
	};
}

sub definition {
	my $class = shift;
	my $ctrl  = shift;
	return {
		name => {
			required => 1,
			name => 'お名前',
		},
		email => {
			required => 1,
			name => 'メールアドレス',
		},
		naiyou => {
			required => 1,
			name => '内容',
		},
	};
}

1;
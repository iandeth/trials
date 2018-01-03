package DevTestSjis::Form::ConfirmVali;
use base Mints::Model::Validation;
use strict;

sub initOption {
	my $class = shift;
	my $ctrl  = shift;
	return {
		runModeOnError => 'Form',
		returnErrorAs  => 'hash',
		fillInFormWith => $ctrl->{in},
	};
}

sub definition {
	my $class = shift;
	my $ctrl  = shift;
	return {
		text1 => {
			required => 1,
			#match    => 'm/^hoge$/',
			name     => 'テキスト1',
		},
		text2 => {
			required => 1,
			name     => 'テキスト2',
			enum     => '1234||5678',
			min_len  => 2,
		},
		check1 => {
			required_if => 'text1',
			min_in_set  => '2 of check1',
			max_values  => 2,
			name        => 'チェック1',
		},
		text3 => {
			name         => 'テキスト3',
		},
		tenpu => {},
	};
}

1;
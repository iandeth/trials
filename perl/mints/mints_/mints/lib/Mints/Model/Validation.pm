package Mints::Model::Validation;
use strict;
our $VERSION = '0.03';

sub initOption {
	my $class = shift;
	my $ctrl  = shift;
	return {
		# define Mints::Controller->validateParam initOptions here
		# runModeOnError => 'Input',
                # viewModuleOnError => 'JSON',
		# fillInFormWith => $ctrl->{in},
		# returnErrorAs  => 'hash',
		# passthru       => { no_extra_fields => 1 },
	};
}

sub definition {
	my $class = shift;
	my $ctrl  = shift;
	return {
		# define CGI::Ex::Validate spec here
		# text1 => {
		# 	required => 1,
		# 	match    => 'm/^hoge$/',
		# },
		# ...
	};
}

1;

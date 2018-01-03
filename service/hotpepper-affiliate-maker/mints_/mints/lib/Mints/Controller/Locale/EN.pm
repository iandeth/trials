package Mints::Controller::Locale::EN;
use base Mints::Controller::Locale;
use strict;
our $VERSION = '0.01';

sub forValidation {
	my $class = shift;
	return {
		match_error       => 'invalid value',
		enum_error        => 'invalid value',
		compare_error     => 'did not fit comparison',
		custom_error      => 'invalid value',
		equals_error      => 'invalid value',
		required_error    => 'required',
		required_if_error => 'required',
		max_values_error  => 'maximum $value items',
		min_values_error  => 'minimum $value items',
		min_in_set_error  => 'lack of selection',
		max_in_set_error  => 'too many selection',
		min_len_error     => 'must be at least $value characters',
		max_len_error     => 'must be less than $value characters',
		no_extra_fields_error => 'should not be passed to validate',
	};
}

sub forDateTime {
	my $class = shift;
	return {
		locale => 'en',
	};
}

1;
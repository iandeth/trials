package Mints::Controller::Locale;
use strict;
our $VERSION = '0.06';

# suspected encoding name for use with Encode::Guess module
# i.e. qw(euc-jp shiftjis iso-2022-jp);
sub forToolsEncode {
	my $class = shift;
	return {
		suspects => [],
	};
}

sub forHttp {
	my $class = shift;
	return {
		utf8   => 'UTF-8',
		ascii  => 'ISO-8859-1',
		latin1 => 'ISO-8859-1',
	};
}

sub getHttpCharset {
	my $class = shift;
	my $codeEncoding = shift;
	my $map = $class->forHttp;
	return $map->{ $codeEncoding } || $codeEncoding;
}

sub forMail {
	my $class = shift;
	return {
		encoding     => 'ascii',
		charset      => 'ascii',
	};
}

sub forValidation {
	my $class = shift;
	return {
		# match_error => 'error message'
		# and other \w+_error definition goes here
	};
}

sub forDateTime {
	my $class = shift;
	return {
		# locale => 'locale name',
	};
}

sub forMySQL {
	my $class = shift;
	return {
		utf8   => 'utf8',
		ascii =>  'ascii',
		latin1 => 'latin1',
	};
}

sub fromTo_preHook {
	my $class = shift;
	my ($from,$to) = ($_[1],$_[2]);
	# do whatever locale oriented routines here,
	# using string $_[0] (and manipulating it directly)
	return 1;
}

1;
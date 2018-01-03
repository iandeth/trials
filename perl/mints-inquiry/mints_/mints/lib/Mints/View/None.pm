package Mints::View::None;
use base Mints::View;
use strict;
our $VERSION = '0.02';

sub processHeader {
	return 1;
}

sub processContent {
	return 1;
}

1;
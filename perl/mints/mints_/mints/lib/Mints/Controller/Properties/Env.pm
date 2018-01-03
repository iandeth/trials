package Mints::Controller::Properties::Env;
use base Mints::Controller::Properties;
use strict;
our $VERSION = '0.01';

sub config {
	my $class = shift;
	return {};
}

sub new {
	my $class = shift;
	my $override = shift || {};
	my %prop;
	my $conf = $class->config;
	my $prop = $class->properties;
	# override %::ENV with default properties
	foreach my $k (keys %{ $prop }){
		$::ENV{$k} = $prop->{$k};
	}
	# bless
	my $self = bless(\%::ENV,$class);
	# lock keys and values
	Hash::Util::lock_keys(%::ENV) if($conf->{lockKeys});
	Hash::Util::lock_hash(%::ENV) if($conf->{lockHash});
	return $self;
}

1;
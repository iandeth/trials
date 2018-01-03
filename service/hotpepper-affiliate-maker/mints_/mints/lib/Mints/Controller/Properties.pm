package Mints::Controller::Properties;
use strict;
use Hash::Util ();
our $VERSION = '0.02';

# define rules
sub config {
	my $class = shift;
	return {
		lockKeys     => 0, # adding keys restricted after constructor
		lockHash     => 0, # cannot change property key + values
	};
}

# define your own sub-class properties here
sub properties {
	my $class  = shift;
	my $extras = shift;
	return {};
}

sub new {
	my $class = shift;
	my $override = shift || {};
	my $extras   = shift || {};
	my %prop;
	my $conf = $class->config;
	my $prop = $class->properties($extras);
	# override with constructor argument hash
	foreach my $k (keys %{ $override }){
		$prop->{$k} = $override->{$k};
	}
	# bless
	my $self = bless($prop,$class);
	# lock keys and values
	Hash::Util::lock_keys(%{ $prop }) if($conf->{lockKeys});
	Hash::Util::lock_hash(%{ $prop }) if($conf->{lockHash});
	return $self;
}

1;
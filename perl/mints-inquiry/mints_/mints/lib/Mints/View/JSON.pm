package Mints::View::JSON;
use base Mints::View;
use 5.8.0;
use strict;
use JSON ();
our $VERSION = '0.04';

sub processHeader {
	my $self = shift;
	my $ctrl = shift;
	print $self->getContentType($ctrl,'text/javascript');
	# print BOM for Safari
	print qq(\x{ef}\x{bb}\x{bf}) if($ctrl->getConfig->{ioEncoding}
		eq 'utf8');
	return 1;
}

sub processErrors {
	my $self = shift;
	my $ctrl = shift;
	my $json = JSON->new(skipinvalid=>1);
	eval {
		my $str = $json->objToJson({ error => $ctrl->getError });
		$self->trEncoding($str);
		print $str;
	};
	if($@){
		my $v = $@;
		print qq({ "error" : "$v" });
	}
	return 1;
}

sub processContent {
	my $self = shift;
	my $ctrl = shift;
	my %opt = (
		convblessed => 1,
		skipinvalid => 1,
		%{ $self->{options} },
	);
	my $json = JSON->new(%opt);
	my $str;
	eval {
		$str = $json->objToJson($ctrl->{mdl})
	};
	if($@){
		$ctrl->setError($@);
		$self->processErrors($ctrl);
		return undef;
	}
	$self->trEncoding($str);
	print $str;
	return 1;
}

1;
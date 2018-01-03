package Mints::View::XML;
use base Mints::View;
use strict;
use 5.8.0;
use XML::Simple ();
$XML::Simple::PREFERRED_PARSER = 'XML::Parser';
our $VERSION = '0.02';

sub processHeader {
	my $self = shift;
	my $ctrl = shift;
	print $self->getContentType($ctrl,'application/xml');
	return 1;
}

sub processErrors {
	my $self = shift;
	my $ctrl = shift;
	my $xs = new XML::Simple(
		NoAttr   => 1,
		RootName => 'perldata',
		%{ $self->{options} },
	);
	my $head = $self->getXmlHeader($ctrl);
	eval {
		my $str = $head . $xs->XMLout({ error => $ctrl->getError });
		$self->trEncoding($str);
		print $str;
	};
	if($@){
		my $rn = $self->{options}{RootName} || 'perldata';
		my $str = $head . qq(<$rn><error>$@</error></$rn>);
		$self->trEncoding($str);
		print $str;
	}
	return 1;
}

sub processContent {
	my $self = shift;
	my $ctrl = shift;
	my %opt = (
		NoAttr => 1,
		RootName => 'perldata',
		%{ $self->{options} },
	);
	my $xs = new XML::Simple(%opt);
	my $head = $self->getXmlHeader($ctrl);
	eval {
		my $str = $head . $xs->XMLout($ctrl->{mdl});
		$self->trEncoding($str);
		print $str;
	};
	if($@){
		$ctrl->setError($@);
		$self->processErrors($ctrl);
		return undef;
	}
	return 1;
}

sub getXmlHeader {
	my $self = shift;
	my $ctrl = shift;
	my $chr  = $ctrl->getLocaleSetting->getHttpCharset(
		$ctrl->getConfig->{ioEncoding},
	);
	return qq(<?xml version="1.0" encoding="$chr"?>\n);
}

1;
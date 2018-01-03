package Mints::View::Javascript;
use base Mints::View;
use 5.8.0;
use strict;
our $VERSION = '0.03';

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
	my $v = join(' ',@{ $ctrl->getError });
	$self->trEncoding($v);
	print "alert('Server-side Error: $v')";
	return 1;
}

1;
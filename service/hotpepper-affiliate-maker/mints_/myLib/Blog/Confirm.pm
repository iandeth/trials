package Blog::Confirm;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	my $honmon = $ctrl->{in}{honmon};
	$honmon =~ s/\r\n/\n/g;
	$honmon =~ s/\r/\n/g;
	my @p = split(/\n{2,}/,$honmon);
	map { s|\n|<br />|g } @p;
	$self->{disp_honmon} = '<p>' . join('</p><p>',@p) . '</p>';
	return 1;
}

1;

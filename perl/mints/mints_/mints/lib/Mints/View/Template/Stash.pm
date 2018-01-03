package Mints::View::Template::Stash;
use Template::Config;
use base ($Template::Config::STASH);
use strict;
our $VERSION = '0.01';

sub get {
    my($self, @args) = @_;
    my($var) = $self->SUPER::get(@args);
    # change character encoding
    if (\$var =~ /SCALAR/) {
        $self->from_to($var) if($self->{ENCODE});
    }
    return $var;
}

sub from_to {
	my $self = shift;
	my $from = $self->{ENCODE}{from};
	my $to   = $self->{ENCODE}{to};
	$self->{ENCODE}{tool}->fromTo($_[0],$from,$to);
	return 1;
}

1;

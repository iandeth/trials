# this module is inspired by Template::Stash::EscapeHTML module,
# created by Tomohiro IKEBE, C<< <ikebe@shebang.jp> >>
# I would like to show my gratitude to Mr.IKEBE, and apology for not
# inheriting his module directly.

package Mints::View::Template::Stash::HTML;
use base Mints::View::Template::Stash;
use strict;
our $VERSION = '0.03';

# those variables defined as a key name in this hash
# will not be html filtered.
our %NoEsc = (
	content => 1,
);

sub get {
	my($self, @args) = @_;
	my($var) = $self->SUPER::get(@args);
	# html escape
	if (\$var =~ /SCALAR/ && !$NoEsc{$args[0]}) {
		return $self->html_filter($var);
	}
	return $var;
}

sub html_filter {
	my $self = shift;
	my $text = shift;
	for ($text) {
		s/&/&amp;/g;
		s/</&lt;/g;
		s/>/&gt;/g;
		s/"/&quot;/g;
	}
	return $text;
}

1;

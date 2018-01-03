package Mints::Controller::CGI::ValidateError;
use base CGI::Ex::Validate::Error;
use strict;

sub as_array {
  my $self = shift;
  my $errors = $self->{errors} || die "Missing errors";
  my $extra  = $self->{extra}  || {};
  my $extra2 = shift || {};

  my $title = defined($extra2->{as_array_title}) ? $extra2->{as_array_title}
    : defined($extra->{as_array_title}) ? $extra->{as_array_title}
    : "Please correct the following items:";

  ### if there are heading items then we may end up needing a prefix
  my $has_headings;
  if ($title) {
    $has_headings = 1;
  } else {
    foreach (@$errors) {
      next if ref;
      $has_headings = 1;
      last;
    }
  }

  my $prefix = defined($extra2->{as_array_prefix}) ? $extra2->{as_array_prefix}
    : defined($extra->{as_array_prefix}) ? $extra->{as_array_prefix}
    : $has_headings ? '  ' : '';

  ### get the array ready
  my @array = ();
  push @array, $title if length $title;

  ### add the errors
  my %found = ();
  foreach my $err (@$errors) {
    if (! ref $err) {
      push @array, $err;
      %found = ();
    } else {
      my $text = $self->get_error_text($err);
      next if $found{$text};
      $found{$text} = 1;
      my$intPrefix = $self->interpolate_name($err,$prefix); # Mints added
      #push @array, "$prefix$text";
      push @array, "$intPrefix$text"; # Mints added
    }
  }

  return \@array;
}

### Mints original method ###
sub interpolate_name {
	my $self = shift;
	my ($err,$tgtStr) = @_;
	my ($field,undef, $field_val, $ifs_match) = @$err;
	my $name = $field_val->{'name'} || "The field $field";
	$name =~ s/\$(\d+)/defined($ifs_match->[$1]) ? $ifs_match->[$1] : ''/eg if $ifs_match;
	$tgtStr =~ s/\$field/$field/g;
	$tgtStr =~ s/\$name/$name/g;
	return $tgtStr;
}

1;
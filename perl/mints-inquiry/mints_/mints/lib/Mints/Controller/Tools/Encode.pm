package Mints::Controller::Tools::Encode;
use base Mints::Controller::Tools;
use strict;
our $VERSION = '0.02';

sub _new_instance {
	my $class = shift;
	my $ctrl  = shift;
	require Encode;
	require Encode::Guess;
	require Encode::Alias;
	my $s = $ctrl->getLocaleSetting->forToolsEncode->{suspects} || [];
	Encode::Guess->set_suspects(@{ $s });
	Encode::Alias::define_alias(qr/UTF-8/ => 'utf8');
	return bless({},$class);
}

sub fromTo {
	my $self = shift;
	my $null = '';
	my ($from,$to) = ($_[1],$_[2]);
	$from ||= 'utf8';
	$to   ||= 'utf8';
	$from = Encode::resolve_alias($from);
	$to   = Encode::resolve_alias($to);
	return undef if(!$from || !$to || $from eq $to || $_[0] eq '');
	Encode::from_to($_[0],$from,$to);
	return 1;
}

sub guessAndFromTo {
	my $self = shift;
	my $defaultEncoding = ($_[1])? $_[1] : 'utf8';
	my $d = Encode::Guess->guess($_[0]);
	my $enc = (ref $d)? $d->name : $defaultEncoding;
	if($enc ne Encode::resolve_alias($defaultEncoding)){
		Encode::from_to($_[0],$enc,$defaultEncoding);
	}
	return 1;
}

sub recursiveFromTo {
	my $self = shift;
	my ($p,$from,$to) = @_;
	die q(need to specify character encoding you'd want to convert)
		. ' from/to' if (!$from || !$to);
	### SCALAR ###
	if(\$p =~ /SCALAR/){
		Encode::from_to($p,$from,$to);
	}else{
		die 'arg is not a reference' if(!ref($p));
		my ($type) = ( $p =~ m|(?:.+?=)?(.+?)\(| );
		### HASH ###
		if($type eq 'HASH'){
			foreach (keys %{$p}){
				$p->{$_} = $self->recursiveFromTo($p->{$_},$from,$to);
			}
		}
		### ARRAY ###
		elsif($type eq 'ARRAY'){
			for (my $i=0; $i < scalar @{ $p }; $i++){
				$p->[$i] = $self->recursiveFromTo($p->[$i],$from,$to);
			}
		}
		### else do nothing ###
		else{}
	}
	return $p;
}

1;
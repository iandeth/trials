package Mints::View::HTML;
use base Mints::View;
use 5.8.0;
use strict;
use Template ();
use Mints::View::Template::Stash::HTML ();
use Mints::View::HTML::Debug ();
our $VERSION = '0.06';

sub processHeader {
	my $self = shift;
	my $ctrl = shift;
	# cookie headers
	foreach my $v (values %{ $ctrl->{ckyset} }){
		print "Set-Cookie: $v\n";
	}
	print $self->getContentType($ctrl,'text/html');
	return 1;
}

sub processErrors {
	my $self = shift;
	my $ctrl = shift;
	# error template check
	my $hasTemplate = $self->hasErrorTemplate($ctrl);
	return if($hasTemplate);
	# else print out pale html
	print q(<html><head><title>error</title></head><body>);
	foreach my $v (@{ $ctrl->getError }){
		$self->trEncoding($v);
		print qq(<pre>$v</pre>)
	}
	print q(</body></html>);
	return 1;
}

sub processContent {
	my $self = shift;
	my ($ctrl,$tmpl) = @_;
	# check for template file existance
	my $ok = $self->resolveTemplate($ctrl);
	if(!$ok){
		$self->processErrors($ctrl);
		return undef;
	}
	# process template
	# using Mints version of Template::Stash for XSS default safety
	my $opt = {
		INCLUDE_PATH => $ctrl->{adm}{appDir},
		INTERPOLATE => 0,
		STASH => Mints::View::Template::Stash::HTML->new({
			HIDDEN => $self->hashToHidden($ctrl->{in}),
			ENCODE => $self->{encode},
		}),
		FILTERS => {
			unesc => \&_HTMLunescape,
		},
		%{ $self->{options} },
	};
	$Mints::View::Template::Stash::HTML::NoEsc{HIDDEN}++;
	my $tt = Template->new($opt) || die $Template::ERROR;
	my $str = '';
	# make a copy of $ctrl (else it'll die with Hash::Util::lock_keys effect)
	my %tgt = %{ $ctrl };
	$ok = $tt->process(
		$self->{template},
		\%tgt,
		\$str
	);
	if(!$ok){
		$ctrl->setError($tt->error);
		$self->processErrors($ctrl);
		return undef;
	}
	# auto fill in form
	if($self->{fillInForm}){
		require CGI::Ex::Fill;
		my $tgt = $self->{fillInFormWith};
		# change Encoding
		if($self->{encode}){
			require Storable;
			$tgt = Storable::dclone($tgt); # make clone
			$self->{encode}{tool}->recursiveFromTo(
				$tgt, $self->{encode}{from}, $self->{encode}{to}
			);
		}
		# fill in
		CGI::Ex::Fill::form_fill(\$str,$tgt);
		delete $self->{fillInFormWith};
	}
	print $str;
	return 1;
}

sub dump {
	my $self = shift;
	my ($ctrl,$debugLevel) = @_;
	if($ctrl->{adm}{execEnv} eq 'web'){
		my $tgt = {
			adm  => $ctrl->{adm},
			in   => $ctrl->{in},
			cky  => $ctrl->{cky},
			mdl  => $ctrl->{mdl},
			view => $ctrl->{view},
		};
		$tgt->{ssn} = $ctrl->{ssn} if($ctrl->{adm}{sessionModule});
		$tgt->{err} = $ctrl->getError if($ctrl->hasError);
		if($debugLevel == 2){
			$tgt->{mdl}     = $ctrl->{mdl},
			$tgt->{ckyset}  = $ctrl->{ckyset},
			$tgt->{con}     = $ctrl->{con},
			$tgt->{env}     = $ctrl->{env},
			$tgt->{include} = \%::INC,
			$tgt->{mints}   = $ctrl->{mints},
		}
		my $d = Mints::View::HTML::Debug->new;
		my $v = $d->Dump($tgt,'$ctrl',1);
		$self->trEncoding($v);
		print $v;
	}else{
		$self->SUPER::dump($ctrl,$debugLevel);
	}
	return 1;
}

sub hashToHidden {
	my $self = shift;
	my $hash = shift;
	my $ret;
	foreach my $k (keys %{$hash}){
		next if($k eq 'rm'); # do not pass runmode param
		if(ref( $hash->{$k} ) =~ /ARRAY/){
			foreach my $i (@{ $hash->{$k} }){
				$ret .= $self->makeHiddenTag($k,$i);
			}
		}else{
			$ret .= $self->makeHiddenTag($k,$hash->{$k});
		}
	}
	return $ret;
}

sub makeHiddenTag {
	my $self = shift;
	my ($k,$v) = @_;
	$k = &_HTMLescape($k) || '';
	$v = &_HTMLescape($v) || '';
	return qq(<input type="hidden" name="$k" value="$v" id="h_$k" />\n);
	# $self->trEncoding is done inside Template::Stash
}

sub _HTMLescape {
	my $text   = shift;
	return if(!defined($text));
	for ($text){
		s/&/&amp;/og;
		s/</&lt;/og;
		s/>/&gt;/og;
		s/"/&quot;/og;
	}
	return $text;
}

sub _HTMLunescape {
	my $text = shift;
	return if(!defined($text));
	for ($text){
		s/&quot;/"/g;
		s/&gt;/>/g;
		s/&lt;/</g;
		s/&amp;/&/g;
	}
	return $text;
}

1;
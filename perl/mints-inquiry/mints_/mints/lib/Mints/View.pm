package Mints::View;
use 5.8.0;
use strict;
use Dumpvalue ();
our $VERSION = '0.08';

sub new {
	my $class = shift;
	my $ctrl  = shift;
	my $p = {};
	if($ctrl->needTrEncoding){
		$p->{encode} = {
			from => $ctrl->getConfig->{codeEncoding},
			to   => $ctrl->getConfig->{ioEncoding},
			tool => $ctrl->grabTool('Encode'),
		};
	}
	return bless($p,$class);
}

sub setProperties {
	my $self = shift;
	my $ctrl = shift;
	$self->resolveUrl($ctrl);
	$self->{options} = {};
	return 1;
}

sub processHeader {
	my $self = shift;
	my $ctrl = shift;
	print $self->getContentType($ctrl);
	return 1;
}

sub getContentType {
	my $self = shift;
	my $ctrl = shift;
	my $mime = shift || 'text/plain';
	my $chr  = $ctrl->getLocaleSetting->getHttpCharset(
		$ctrl->getConfig->{ioEncoding},
	);
	return "Content-Type: $mime; charset=${chr}\n\n";
}

sub processErrors {
	my $self = shift;
	my $ctrl = shift;
	# error template check
	my $hasTemplate = $self->hasErrorTemplate($ctrl);
	return if($hasTemplate);
	# print plain text
	foreach my $e (@{ $ctrl->getError }){
		$self->trEncoding($e);
		print $e;
	}
	return 1;
}

sub hasErrorTemplate {
	my $self = shift;
	my $ctrl = shift;
	my $tmpl = $ctrl->getConfig->{errorTemplate};
	# if error template specified
	if($tmpl){
		$ctrl->setTemplate($tmpl);
		my $ok = $self->resolveTemplate($ctrl);
		if($ok){
			$self->processContent($ctrl);
			return 1;
		}
	}
	return undef;
}

sub processContent {
	my $self = shift;
	my $ctrl = shift;
	# check for template file existance
	my $ok = $self->resolveTemplate($ctrl);
	if(!$ok){
		$self->processErrors($ctrl);
		return undef;
	}
	# process template
	require Template;
	require Mints::View::Template::Stash;
	my $opt = {
		INCLUDE_PATH => $ctrl->{adm}{appDir},
		INTERPOLATE => 0,
		STASH => Mints::View::Template::Stash->new({
			ENCODE => $self->{encode},
		}),
		%{ $self->{options} },
	};
	my $tt = Template->new($opt) || die $Template::ERROR;
	# make a copy of $ctrl (else it'll die with Hash::Util::lock_keys effect)
	my %tgt = %{ $ctrl };
	$ok = $tt->process(
		$self->{template},
		\%tgt,
	);
	if(!$ok){
		$ctrl->setError($tt->error);
		return $self->processErrors($ctrl);
	}
	return 1;
}

sub dump {
	my $self = shift;
	my ($ctrl,$debugLevel) = @_;
	# delete sys-erorrs unless not null
	delete $ctrl->{err} unless($ctrl->hasError);
	# delete sessions unless not null
	delete $ctrl->{ssn} unless($ctrl->{adm}{sessionModule});
	# delete unwanted objects
	if($debugLevel < 2){
		delete $ctrl->{con};
		delete $ctrl->{cky};
		delete $ctrl->{ckyset};
		delete $ctrl->{env};
		delete $ctrl->{mints};
	}
	# dump with Dumpvalue module
	my $prefh = select(STDERR);
	print "\n\n__DATA DUMP__\n";
	#$self->{encode}{tool}->recursiveFromTo(
	#	$ctrl, $self->{encode}{from}, $self->{encode}{to}
	#) if($self->{encode});
	Dumpvalue->new->dumpValue($ctrl);
	if($debugLevel == 3){
		print "\n__INCLUDE MODULES__\n";
		Dumpvalue->new->dumpValue(\%::INC);
	}
	select($prefh);
	return 1;
}

sub resolveTemplate {
	my $self = shift;
	my $ctrl = shift;
	my $ext = $ctrl->getConfig->{templateExtension} || '.tmpl';
	$self->{template} = "$ctrl->{adm}{runMode}$ext" if(!$self->{template});
	my $tmplpath = $ctrl->{adm}{appDir}.'/'.$self->{template};
	if(!-f $tmplpath){
		$ctrl->setError("no such template: $tmplpath");
		return undef;
	}
	return 1;
}

sub resolveUrl {
	my $self = shift;
	my $ctrl = shift;
	if($ctrl->{adm}{execEnv} ne 'web'){
		foreach (qw(url urlCgi urlApp urlSrc)){
			delete $self->{$_};
		}
		return undef;
	}
	# script url
	$self->{urlCgi} = $::ENV{SCRIPT_NAME};
	# runMode url
	my $appName = ($ctrl->{mints}{hideAppNameFromUrl})?
		'' : "$ctrl->{adm}{appName}/";
	$self->{url} = "$self->{urlCgi}/$appName$ctrl->{adm}{runMode}";
	# app url
	$self->{urlApp} = ($ctrl->{mints}{hideAppNameFromUrl})?
		$self->{urlCgi} : "$self->{urlCgi}/$ctrl->{adm}{appName}";
	# src url for .jpg and .js
	$self->{urlSrc} = $ctrl->getConfig->{urlSrc};
	if(!$self->{urlSrc}){
		(my $path = $self->{urlCgi}) =~ s|^/||;
		my @tmp = split(/\//,$path);
		$tmp[ $#tmp ] =~ s|\.(.+)||;
		$tmp[ $#tmp ] = $tmp[ $#tmp ].'_';
		$path = join('/',@tmp);
		$self->{urlSrc} = '/'.$path."/www/$ctrl->{adm}{appName}";
	}
	return 1;
}

sub trEncoding {
	my $self = shift;
	return undef if(!$self->{encode});
	$self->{encode}{tool}->fromTo(
		$_[0],
		$self->{encode}{from},
		$self->{encode}{to},
	);
	return 1;
}

1;
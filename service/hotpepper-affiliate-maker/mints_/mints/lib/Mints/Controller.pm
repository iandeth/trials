package Mints::Controller;
use strict;
use Carp ();
use Hash::Util ();
# non-standard modules
use CGI::Lite ();
use Mints::Controller::Properties::Admin ();
use Mints::Controller::Properties::Constants ();
use Mints::Controller::Properties::Input ();
use Mints::Controller::Properties::Env ();
use Mints::Controller::Locale ();
our $VERSION = '0.25';

sub getConfig {
	my $self = shift;
	return {
		defaultRunMode    => 'Index',
		localeModule      => 'Mints::Controller::Locale::JP',
		viewModule        => 'Mints::View::HTML',
		ioEncoding        => 'utf8',
		codeEncoding      => 'utf8',
		debug             => 0,     # dump debug data to STDERR
		datDir            => undef, # data file i/o directory
		maxUploadSize     => 10000, # in bytes
		errorTemplate     => undef, # '/path/to/error.tmpl'
		templateExtension => undef, # '.html'
		urlSrc            => undef, # '/path/to/www/src'
		umask             => 0022,
		%{ $self->config },
	};
}

sub config {
	my $self = shift;
	return {};
}

sub dbConfig {
	my $self = shift;
	return {
		# driver   => 'mysql',
		# database => 'mints',
		# host     => 'localhost',
		# user     => 'webadm',
		# passwd   => 'mints!',
		# passthru => {}, # any other attributes for DBI->connect method
	}
}

sub sessionConfig {
	return {
		# module  => 'Mints::Controller::Properties::Sessions::File',
		# expires => '+1M',
		# path    => '', # default is $self->{env}{SCRIPT_NAME}
	};
}

sub constants {
	my $self = shift;
	return {
		# define your original constants in sub-class
		# myConstant => 'iandeth99@ybb.ne.jp',
	};
}

sub runChains {
	my $self = shift;
	return [
		'parseParam',     # set input arguments/parameters
		'parseCookies',   # read cookies sent from browser
		'loadSession',    # get sid from cookie + load session vars
		'resolveRunMode', # fix which run mode to dispatch
		'setViewModule',  # create view instance
		'dispatch',       # param validation + build model
	];
}

sub new {
	my $class = shift;
	# constructor options/arguments
	my %o = (
		out => *STDOUT,
		appDir => undef,
		datDir => undef,
		runMode => undef,
		execEnv => undef,
		mintsInstance => undef,
		@_,
	);
	# change standard output
	select($o{out});
	# define instance property
	my $self = bless({
		in     => {}, # input arguments/parameters
		adm    => {}, # administrative settings
		con    => {}, # constant variables
		cky    => {}, # cookies from browser
		ckyset => {}, # cookies which will be set to http header
		err    => [], # framework trapped error messages
		env    => {}, # environment variables
		ssn    => {}, # persistant session data
		mdl    => {}, # model instance
		view   => {}, # view instance
		mints  => $o{mintsInstance}, # Mints class instance
	},$class);
	# can't add any new keys in $self anymore
	Hash::Util::lock_keys(%{ $self });
	# load environment variables
	$self->{env} = Mints::Controller::Properties::Env->new(\%::ENV);
	# load constant variables
	$self->{con} = Mints::Controller::Properties::Constants->new(
		$self->constants);
	# administrative settings
	$self->{adm} = Mints::Controller::Properties::Admin->new(
		$self->getConfig,           # load configurations
		{
			runMode => $o{runMode}, # run mode
			appDir  => $o{appDir},  # app directory
			execEnv => $o{execEnv}, # web or term
		},
	);
	# get rid of non-admin config setting from $self->{adm}
	$self->{adm}->moveAwayNonAdmins($self);
	# auto-define lib and work directories
	$self->setDirectories($o{datDir});
	# settings for debug mode
	if($self->isDebugMode && $self->{adm}{execEnv} eq 'web'){
		# write STDERR to debug file - for web execution
		require CGI::Carp;
		CGI::Carp->import('fatalsToBrowser');
		my $ok = open(my $fh,'>>',$self->{adm}{debugFile});
		unless($ok){
			(my $dir = $self->{adm}{debugFile}) =~ s|[^/]+$||;
			die "must add write permission (chmod) to directory:  $dir\n";
		}
		CGI::Carp::carpout($fh);
	}else{
		delete $self->{adm}{debugFile};
	}
	# environment settings
	binmode(STDIN);
	binmode(STDOUT);
	umask( $self->getConfig->{umask} );
	$| = 1;
	return $self;
}

sub setDirectories {
	my $self = shift;
	my $datDir = shift || '.';
	$self->{adm}{datDir}    = $datDir if(!$self->{adm}{datDir});
	$self->{adm}{debugFile} = $datDir.'/debug'
		if(!$self->{adm}{debugFile});
	$self->{adm}{uploadDir} = $datDir.'/_upload'
		if(!$self->{adm}{uploadDir});
	# work directories - sanitize & permission check
	foreach my $d (qw(datDir uploadDir debugFile)){
		# sanitize for security (taint mode)
		$self->{adm}{$d} =~ s/[\|\<\>]//og;
		($self->{adm}{$d}) = ($self->{adm}{$d} =~ /(.+)/o);
	}
	# create form upload directory
	mkdir($self->{adm}{uploadDir}) if(!-d $self->{adm}{uploadDir});
	# existance + writeable check
	foreach my $d (qw(datDir uploadDir)){
		my $dir = $self->{adm}{$d};
		# existance check
		$self->setError("checkDir: directory doesn't exist ($dir)")
			if(!-e $dir);
		# writeability check
		$self->setError('checkDir: must add write permission to '
			. "directory - $dir") if(!-w $dir);
	}
	return 1;
}

sub run {
	my $self = shift;
	my %o = (
		runMode => undef,
		@_,
	);
	# set run mode if specified (with args)
	$self->{adm}{runMode} = $o{runMode} if($o{runMode});
	# loop execute method chains
	my $chain = $self->runChains;
	if(!$self->hasError){
		foreach my $method (@{ $chain }){
			my $ok = $self->$method;
			last if(!$ok || $self->hasError);
		}
	}
	# print output
	$self->processView;
	# remove uploadFiles and stuff
	$self->teardown;
	return 1;
}

sub parseParam {
	my $self = shift;
	if(defined $::ENV{CONTENT_TYPE}
		&& $::ENV{CONTENT_TYPE} =~ m|^application/x-www-form-urlencoded|){
		$::ENV{CONTENT_TYPE} =~ s/;.+//g; # for some mobile phone
	}
	my $p = CGI::Lite->new();
	my $param = {};
	# argument parsing - with terminal execution
	if($self->{adm}{execEnv} eq 'term' && @::ARGV){
		foreach my $str (@::ARGV){
			# get parameter emulation with - query='.+'
			if($str =~ /^query=(.+)$/o){
				$self->{env}{REQUEST_METHOD} = 'GET';
				$self->{env}{QUERY_STRING}   = $1;
			# else split with '='
			}else{
				my ($k,$v) = split(/=/,$str);
				$param->{$k} = $v;
			}
		}
	}
	# configuration for file uploads
	$p->set_platform("Unix");
	$p->add_timestamp(0);
	$p->set_directory($self->{adm}{uploadDir}) or die $!;
	# filtering uploaded filename
	$CGI::Lite::ctrl = $self; # since filter_filename isn't OOP styled
	$p->filter_filename(sub {
		my $fnm = shift;
		return if(!$fnm);
		$fnm =~ s/[\s\|\<\>]//og; # Taint clean
		($fnm) = ($fnm =~ /(.+)/o);
		# make customized filename
		my $ctrl = $CGI::Lite::ctrl;
		require Apache::Session::Generate::MD5;
		my $crypted = substr(
			Apache::Session::Generate::MD5::generate(),0,16);
		$fnm = $crypted.'__'.$fnm;
		my $et = $ctrl->grabTool('Encode');
		$et->guessAndFromTo($fnm,$ctrl->getConfig->{codeEncoding});
		push(@{ $ctrl->{adm}{uploadFiles} },$fnm);
		return $fnm;
	});
	# parsing POST's & GET's
	my %post = $p->parse_form_data("post");
	my %get  = $p->parse_form_data("get");
	$param = { %{$param}, %post, %get };
	# clean up
	undef $CGI::Lite::ctrl;
	# tr CR+LF CR to LF
	foreach (keys %{ $param }){
		$param->{$_} =~ s/\r\n/\n/g;
		$param->{$_} =~ s/\r/\n/g;
	}
	# change encoding of all params
	if($self->needTrEncoding || $param->{'mints-enc'}){
		my $from = $param->{'mints-enc'}
			|| $self->getConfig->{ioEncoding};
		my $et = $self->grabTool('Encode');
		foreach my $v (keys %{ $param }){
			if(ref($param->{$v}) =~ /ARRAY/){
				for(my $i=0; $i < scalar @{ $param->{$v} }; $i++){
					$et->fromTo($param->{$v}[$i],$from,
						$self->getConfig->{codeEncoding});
				}
			}else{
				$et->fromTo($param->{$v},$from,
					$self->getConfig->{codeEncoding});
			}
		}
	}
	# check if uploaded file exceeds maxUploadSize
	my $maxsize = $self->getConfig->{maxUploadSize};
	foreach my $fnm (@{ $self->{adm}{uploadFiles} }){
		my $size = -s "$self->{adm}{uploadDir}/$fnm";
		if ($maxsize && $size > $maxsize){
			$self->setError("the size of upload file is too big (yours:${size}bytes, max:${maxsize}bytes)");
			return undef;
		}
	}
	# set
	$self->{in} = Mints::Controller::Properties::Input->new($param);
	return 1;
}

sub parseCookies {
	my $self = shift;
	return 1 unless($self->{adm}{execEnv} eq 'web');
	require CGI::Cookie;
	require Mints::Controller::Properties::Cookies;
	my %cky = CGI::Cookie->fetch();
	my %ret;
	foreach my $v (keys %cky){
		$ret{$v} = $cky{$v}->value;
		utf8::encode($ret{$v});
	}
	# change encoding
	if($self->needTrEncoding){
		my $et = $self->grabTool('Encode');
		foreach my $v (keys %cky){
			$et->fromTo(
				$ret{$v},
				$self->getConfig->{ioEncoding},
				$self->getConfig->{codeEncoding},
			);
		}
	}
	$self->{cky} = Mints::Controller::Properties::Cookies->new(\%ret);
	return 1;
}

sub loadSession {
	my $self = shift;
	my $config = $self->sessionConfig;
	return 1 unless($config->{module});
	my $ok = $self->loadModule($config->{module});
	if(!$ok){
		$self->setError('error loading session');
		return undef;
	}
	$self->{ssn} = $config->{module}->new(undef,$self);
	return 1;
}

sub setViewModule {
	my $self = shift;
	my $moduleName = shift;
	# auto define from param
	if(!$moduleName){
		foreach my $type (qw(HTML JSON XML)){
			$moduleName = "Mints::View::$type" if(exists $self->{in}{$type});
		}
	# fix to correct module name
	}elsif($moduleName !~ /::/){
		$moduleName = "Mints::View::$moduleName";
	}
	# create view handler instance
	my $module = $moduleName || $self->getConfig->{viewModule}
		|| 'Mints::View::None';
	my $ok = $self->loadModule($module);
	die join("\n",@{ $self->getError }) unless($ok);
	$self->{view} = $module->new($self);
	# set properties
	$self->{view}->setProperties($self);
	return 1;
}

sub resolveRunMode {
	my $self = shift;
	my $runMode = $self->{adm}{runMode};
	if(!$runMode){
		# define run mode - from param
		#if($self->{in}{rm}){
		#	$runMode = $self->{in}{rm};
		#	$runMode =~ s|_|/|og;
		#}
		# define run mode - default setting
		$runMode = $self->getConfig->{defaultRunMode} if(!$runMode);
		if(!$runMode){
			$self->setError("resolveRunMode: cannot specify runMode");
			return undef;
		}
	}
	# Taint clean
	$runMode =~ s/[\s\|\<\>]//og;
	($runMode) = ($runMode =~ /(.+)/o);
	# error check
	my $path = "$self->{adm}{appDir}/${runMode}.pm";
	if(!-f $path){
		$self->setError("no such file (module): $path");
		return undef;
	}
	# fix run mode
	$self->{adm}{runMode} = $runMode;
	return 1;
}

sub dispatch {
	my $self = shift;
	my $previousModel = shift; # only with redispatch
	# parameter validation
	my $valiErr = $self->validateParam;
	# build model
	$self->buildModel($valiErr,$previousModel) if(!$self->hasError);
	if(!$self->hasError){ return 1     }
	else                { return undef }
}

sub validateParam {
	my $self = shift;
	# auto-define validate module name from runMode
	my $name = $self->{adm}{runMode}.'Vali';
	# do nothing if module doesn't exist
	return undef if(!-f "$self->{adm}{appDir}/${name}.pm");
	# load validation module
	my $module = "$self->{adm}{appName}/$name";
	$module =~ s|/|::|g;
	my $ok = $self->loadModule($module);
	return undef unless($ok);
	# get definitions and initOptions
	my $def = $module->definition($self);
	my $opt = $module->initOption($self);
	# do validation
	my $err = $self->validate(
		definition => $def,
		%{ $opt },
	);
	# return if no error
	return undef unless($err);
	# reset runMode
	my $rm = $opt->{runModeOnError};
	if($rm eq ''){
		my $path = $self->{env}{HTTP_REFERER};
		$path =~ s/\?.+$//;
		my $pn = ($self->{mints}{hideAppNameFromUrl})?
			$self->{view}{urlCgi} : $self->{view}{urlApp};
		($rm) = ($path =~ m|^.+?$pn/(.+)|); # jump to previous page
		$rm = join('/', map { ucfirst } split(/\//,$rm) );
		($rm) = ($rm =~ /(.+)/); # untaint
		$rm ||= $self->{adm}{defaultRunMode}; # or back to default page
	}
	$self->{adm}{runMode} = $rm;
	$self->{view}->resolveUrl($self);
	$self->fillInFormWith($opt->{fillInFormWith});
	return $err;
}

sub buildModel {
	my $self = shift;
	my $valiError = shift;
	my $previousModel = shift; # only with page redirection
	my $runMode = $self->{adm}{runMode};
	# do handler()
	(my $pkg = "$self->{adm}{appName}::$runMode") =~ s|/|::|g;
	my $ok = $self->loadModule($pkg);
	return undef unless($ok);
	eval(qq(
		\$self->{mdl} = $pkg->new(\$valiError);
		\$self->{mdl}->handler(\$self);
	));
	if($@){
		$self->setError("buildModel: error while executing handler method - ".$@);
		return undef;
	}
	# with page redirection - combine 2 data objects
	if($previousModel){
		my $class = ref $self->{mdl};
		foreach (keys %{ $self->{mdl} }){
			$previousModel->{$_} = $self->{mdl}{$_};
		}
		$self->{mdl} = bless($previousModel,$class);
	}
	return 1;
}

sub processView {
	my $self = shift;
	# create view instance if needed
	$self->setViewModule if($self->{view} !~ /=/);
	# http headers
	if($self->{adm}{execEnv} eq 'web'){
		print "Status: 500\n" if($self->hasError);
		$self->{view}->processHeader($self);
	}
	# error message
	if($self->hasError){
		$self->{view}->processErrors($self);
	# content
	}else{
		$self->{view}->processContent($self);
	}
	# dump for debug
	if($self->isDebugMode){
		$self->{view}->dump($self,$self->getDebugLevel);
	}
	return 1;
}

sub teardown {
	my $self = shift;
	# remove upload files
	foreach my $f (@{ $self->{adm}{uploadFiles} }){
		my $path = "$self->{adm}{uploadDir}/$f";
		unlink($path);
	}
	return 1;
}

sub isDebugMode {
	my $self = shift;
	# config setting over-rides adm setting
	return ($self->getConfig->{debug} && $self->{adm}{debug})? 1 : 0;
}

sub getDebugLevel {
	my $self = shift;
	my $c = $self->getConfig->{debug};
	my $d = $self->{adm}{debug};
	return ($c > $d)? $c : $d;
}

sub getLocaleSetting {
	my $self = shift;
	my $moduleName = $self->getConfig->{localeModule};
	$self->loadModule( $moduleName );
	return $moduleName;
}

sub setError {
	my $self = shift;
	push(@{ $self->{err} },shift);
	return 1;
}

sub getError {
	return shift->{err};
}

sub hasError {
	return scalar @{ shift->{err} };
}

sub redispatch {
	my $self = shift;
	my $runMode = shift;
	# escape from recursive self-call
	return undef if($self->{adm}{runMode} eq $runMode);
	# reset run mode
	$self->{adm}{runMode} = $runMode;
	$self->{view}->resolveUrl($self);
	$self->dispatch($self->{mdl});
	return 1;
}

sub cleanDirectoryPath {
	my $self = shift;
	$_[0] =~ s{^(/|\.)+|[<>\-\|]}{}og;
	return 1;
}

sub setCookie {
	my $self = shift;
	my %param = (
		name    => 'null',
		value   => undef,
		expires => undef,
		path    => undef,
		@_
	);
	foreach my $k (qw(name value expires path)){
		$param{"-$k"} = $param{$k};
		delete $param{$k};
	}
	if($self->needTrEncoding){
		my $et = $self->grabTool('Encode');
		$et->fromTo(
			$param{'-value'},
			$self->getConfig->{codeEncoding},
			$self->getConfig->{ioEncoding},
		);
	}
	require CGI::Cookie;
	$self->{ckyset}{ $param{-name} } = CGI::Cookie->new(%param);
	return 1;
}

sub sendMail {
	my $self = shift;
	my %o = (
		to         => '',
		cc         => '',
		bcc        => '',
		from       => $self->{env}{SERVER_ADMIN} || 'mints@localhost',
		subject    => 'mail sent by Mints framework',
		message    => '',
		passthru   => {},
		template   => "$self->{adm}{runMode}.mail",
		sendMethod => 'smtp',
		sendHost   => 'localhost',
		sendArgs   => {},
		returnInstance => 0,
		@_,
	);
	if(!$o{to}){
		$self->setError('sendMail : no recipient!');
		return undef;
	}
	my $locale = $self->getLocaleSetting->forMail;
	my %mailOpt = (
		Type     => "text/plain; charset=$locale->{charset}",
		Encoding => '7bit',
		To       => $o{to},
		From     => $o{from},
		Subject  => $o{subject},
		Data     => $o{message},
		%{ $o{passthru} },
	);
	
	$self->cleanDirectoryPath($o{template});
	if(!$mailOpt{Data} && $o{template}){
		if(!-f $self->{adm}{appDir}.'/'.$o{template}){
			$self->setError("sendMail: no such template ($o{template})");
			return undef;
		}
		# message - create using Template
		require Template;
		require Mints::View::Template::Stash;
		my $opt = {
			INCLUDE_PATH => $self->{adm}{appDir},
			INTERPOLATE => 0,
			STASH => Mints::View::Template::Stash->new({
				ENCODE => $self->{view}{encode},
			}),
		};
		my $tt = Template->new($opt) || die $Template::ERROR;
		# make a copy (else it'll die with Hash::Util::lock_keys effect)
		my %tgt = %{ $self };
		my $ok = $tt->process($o{template},\%tgt,\$mailOpt{Data});
		if(!$ok){
			$self->setError($tt->error);
			return undef;
		}
	}
	# multi-byte character encode
	require MIME::Base64;
	my $et   = $self->grabTool('Encode');
	my $from = $self->getConfig->{codeEncoding};
	my $to   = $locale->{encoding};
	my $reqEncs = ' To From Cc Bcc Sender Reply-To Errors-To ';
	foreach (keys %mailOpt){
		if(
			$locale->{charset} ne 'ascii'
			&& $reqEncs =~ / $_ /
			&& $mailOpt{$_} =~ /"(.+?)"\s*?<(.+?)>/
		){
			my($name,$email) = ($1,$2);
			$et->fromTo($name,$from,$to);
			$name = MIME::Base64::encode_base64($name);
			chomp $name;
			$name = '=?'. $locale->{charset} .'?B?'. $name .'?=';
			$mailOpt{$_} = qq($name <$email>);
		}else{
			$et->fromTo($mailOpt{$_},$from,$to);
		}
	}
	# create object
	require MIME::Lite;
	MIME::Lite->send($o{sendMethod},$o{sendHost},%{ $o{sendArgs} });
	my $msg = MIME::Lite->new(%mailOpt);
	return $msg if($o{returnInstance});
	# and finally send mail
	my $ok = $msg->send;
	if(!$ok){
		$self->setError('sendMail: failed sending mail');
		return undef;
	}
	return 1;
}

sub returnFileDownload {
	my $self = shift;
	my %o = (
		readFile => '',
		string   => 'empty ;P',
		fileName => 'download.txt',
		@_,
	);
	$self->cleanDirectoryPath($o{readFile});
	# from string or from file
	my $fileMode = ($o{readFile})? 1 : 0;
	my $filePath = $self->{adm}{datDir}.'/'.$o{readFile};
	# error check
	if($fileMode && !-f $filePath){
		$self->setError("returnDownload: file doesn't exist ($filePath)");
		return undef;
	}
	# content length
	my $length;
	if($fileMode){ $length = -s $filePath       }
	else         { $length = length($o{string}) }
	# print http header
	print qq(Content-Disposition: attachment; filename="$o{fileName}"\n);
	print qq(Content-Length: $length\n) if($length);
	print qq(Content-Type: application/octet-stream\n\n);
	# print content
	if($fileMode){
		open(my $fh,'<',$filePath) or die $!;
		local($/) = undef;
		print <$fh>;
	}else{
		print $o{string};
	}
	# force not to process view anymore
	$self->setViewModule('Mints::View::None');
	return 1;
}

sub redirect {
	my $self = shift;
	my $tgt  = shift || $self->{adm}{defaultRunMode};
	my %query = @_;
	my $url;
	# define full url
	if($tgt !~ m|^(http(s)?://)|){
		my $ptcl = ($self->{env}{HTTPS})? 'https' : 'http';
		$url = "$ptcl://$self->{env}{SERVER_NAME}$self->{env}{SCRIPT_NAME}/";
		my $str .= ($self->{mints}{hideAppNameFromUrl})?
			"$tgt" : "$self->{adm}{appName}/$tgt";
		$url .= join('/', map { lcfirst } split(/\//,$str)  );
	}else{
		$url = $tgt;
	}
	# append get query
	my @q;
	if($self->needTrEncoding){
		my $et = $self->grabTool('Encode');
		foreach (keys %query){
			$et->fromTo(
				$query{$_},
				$self->getConfig->{codeEncoding},
				$self->getConfig->{ioEncoding},
			);
		}
	}
	foreach (keys %query){
		my $v = CGI::Lite::url_encode($query{$_});
		push(@q,"$_=$v");
	}
	$url .= '?' . join('&',@q) if(@q);
	# save session to file
	untie $self->{ssn};
	# print cookie headers
	foreach my $v (values %{ $self->{ckyset} }){
		print "Set-Cookie: $v\n";
	}
	# print location header
	print qq(Location: $url\n\n);
	# force not to process view anymore
	$self->setViewModule('Mints::View::None');
	return 1;
}

sub validate {
	my $self = shift;
	my %o = (
		definition    => {},
		returnErrorAs => 'string',
		passthru      => {},
		target        => $self->{in},
		@_,
	);
	# load validation module
	require CGI::Ex::Validate;
	require Mints::Controller::CGI::ValidateError;
	local $CGI::Ex::Validate::ERROR_PACKAGE
		= 'Mints::Controller::CGI::ValidateError';
	# load locale oriented error messages
	my $errorMsgDef = $self->getLocaleSetting->forValidation;
	# create validation object
	my $vob = CGI::Ex::Validate->new({
		no_extra_fields   => 0,
		as_string_join    => '<br />',
		as_array_prefix   => '$name: ',
		as_array_title    => '',
		as_hash_join      => ' / ',
		as_hash_suffix    => '',
		%{ $errorMsgDef },
		%{ $o{passthru} },
	});
	my $errobj = $vob->validate($o{target},$o{definition});
	if($errobj){
		my $type = $o{returnErrorAs};
		if   ($type =~ /^array/i){ return $errobj->as_array  }
		elsif($type =~ /^hash/i) { return $errobj->as_hash   }
		else                     { return $errobj->as_string }
	}
	return undef;
}

sub connectDB {
	my $self = shift;
	# load DBI
	require Mints::Controller::DBI;
	# load configuration
	my $dbConf = $self->dbConfig;
	# dbi connect
	my($d,$db,$h) = ($dbConf->{driver},$dbConf->{database},$dbConf->{host});
	my $dsn = "DBI:$d:database=$db;host=$h";
	my $dbh = Mints::Controller::DBI->connect_cached(
		$dsn,
		$dbConf->{user},
		$dbConf->{passwd},
		{
			AutoCommit => 0,
			RaiseError => 1,
			%{ $dbConf->{passthru} ||= {} },
		}
	);
	# things to do only for the first connection
	if(!$self->{adm}{database}){
		# debug
		if($self->isDebugMode){
			$DBI::neat_maxlen = 9999;
			my $file = "$self->{adm}{debugFile}.db";
			#unlink($file) if($file);
			$dbh->trace(1,$file);
			$dbh->{Profile} = "DBI::Profile";
		}
		# do driver oriented initialization
		# only if driver module exists
		my $driver = "Mints::Controller::DBI::Driver::$dbConf->{driver}";
		eval("use $driver");
		if(!$@){
			my $d = $driver->new;
			$d->initialize($self,$dbh);
		}
		# set dsn to admin setting
		$self->{adm}{database} = $dsn;
	}
	return $dbh;
}

sub loadModule {
	my $self = shift;
	my $module = shift;
	(my $req = $module) =~ s|::|/|og;
	eval("require '$req.pm'");
	if($@){
		$self->setError('loadModule: '.$@);
		return undef;
	}
	return 1;
}

sub grabTool {
	my $self = shift;
	my $toolName = shift;
	my $modName = "Mints::Controller::Tools::$toolName";
	$self->loadModule($modName);
	return $modName->instance($self);
}

sub fillInFormWith {
	my $self = shift;
	my $tgtHashRef = shift;
	return if(!ref($tgtHashRef));
	$self->{view}{fillInForm} = 1;
	$self->{view}{fillInFormWith} = $tgtHashRef;
	return 1;
}

sub setTemplate {
	my $self = shift;
	$self->{view}{template} = shift;
	return 1;
}

sub setViewOptions {
	my $self = shift;
	my %opt  = @_;
	$self->{view}{options} = \%opt;
	return 1;
}

sub needTrEncoding {
	my $self = shift;
	return ($self->getConfig->{codeEncoding}
		eq $self->getConfig->{ioEncoding})? 0 : 1;
}

1;
package Mints::Controller::Tools::DateTimeCpan;
use base Mints::Controller::Tools;
use strict;

sub _new_instance {
	my $class = shift;
	my $ctrl  = shift;
	require DateTime;
	require DateTime::Format::Strptime;
	return bless({
		locale => $ctrl->getLocaleSetting->forDateTime->{locale},
		admNow => "$ctrl->{adm}{nowYmd} $ctrl->{adm}{nowHms}",
	},$class);
}

sub now {
	my $self = shift;
	my $s = DateTime::Format::Strptime->new(
		pattern   => '%Y/%m/%d %H:%M:%S',
		time_zone => 'local',
		locale    => $self->{locale},
		@_,
	);
	return $s->parse_datetime($self->{admNow});
}

# dynamically create DateTime constructor methods
our @constructors = qw(
	new
	from_epoch
	today
	from_object 
	last_day_of_month
	from_day_of_year
	clone
);
foreach my $n (@constructors){
	eval(qq(
		sub $n {
			my \$self = shift;
			return DateTime->$n(
				time_zone => 'local',
				locale    => \$self->{locale},
				\@_
			);
		}
	));
}

# DateTime::Format::* auto parser / formatter
sub parse {
	my $self = shift;
	my $date = shift;
	my $type = shift || undef;
	my $attr = shift || {};
	my $dt;
	my @parsers;
	if($type){
		push(@parsers,"DateTime::Format::$type");
	}else{
		@parsers = qw(
			DateTime::Format::Mail
			DateTime::Format::HTTP
			DateTime::Format::ISO8601
			DateTime::Format::Japanese
		);
	}
	foreach my $p (@parsers) {
		$self->_loadModule($p);
		$dt = eval { $p->new(%{$attr})->parse_datetime($date) };
		last if $dt;
	}
	$dt->set_locale($self->{locale});
	$dt->set_time_zone('local');
	return $dt;
}

sub format {
	my $self = shift;
	my $dt   = shift;
	my $type = shift || 'HTTP';
	my $attr = shift || {};
	my $mdl  = "DateTime::Format::$type";
	$self->_loadModule($mdl);
	$dt->set_locale('en_US'); # reset locale
	if($type eq 'HTTP'){
		return $mdl->format_datetime($dt);
	}else{
		return $mdl->new(%{$attr})->format_datetime($dt);
	}
}

sub calendar {
	my $self = shift;
	my ($y,$m) = ($self->{admNow} =~ m|^(\d{4})/(\d{2})|);
	my %o = (
		year  => $y,
		month => $m,
		flg   => 0,
		@_,
	);
	my $YYYYMM = $o{year}.$o{month};
	### error check ###
	if(length($YYYYMM) != 6 || $YYYYMM =~ /[^0-9]/){
		warn "Tools::DateTime::calendar - wrong argument (year: $o{year}, month: $o{month})";
		return undef;
	}
	### end of the week = sunday or saturday? ###
	# 7 : sunday / 6: saturday
	my $end_day = ($flg)? 7 : 6;
	### get days in month ###
	my ($y,$m)	= unpack("a4a2",$YYYYMM);
	my $days_in_m = DateTime->last_day_of_month(year=>$y, month=>$m)->day;
	### define the first sunday/saturday ###
	my($w,$d,$now,@cal);
	my $dt = DateTime->new(year=>$y,month=>$m);
	for $d (1 .. 7){
		$dt->set_day($d);
		$w = $dt->wday;                      # define which day of the week
		push(@{$cal[0]},sprintf("%02d",$d)); # create $cal[0]->[] object
		$now = $d;                           # set the day at the moment
		last if $w eq $end_day;              # last if Wday = sunday/saturday
	}
	### organize 1st week array ###
	$d = $now; # set the day at the moment
	while($d < 7){
		unshift(@{$cal[0]}," "); # fill in all the blank date with " "
		$d++;
	}
	### set 2 - 5 th week ###
	my $i = 1; # set obj $cal[1]->[] (2nd week)
	my $start = ($now == $days_in_m)? $now : $now+1;
	for my $d ($start .. $days_in_m){
		push(@{$cal[$i]},sprintf("%02d",$d)); # create $cal[$i]->[] object
		$dt->set_day($d);
		my $w = $dt->wday;
		$i++ if($w eq $end_day); # move to next week if the date = sunday/saturday
	}
	### organize the last week array ###
	while ($#{$cal[$#cal]} < 6){
		push(@{$cal[$#cal]},undef); # fill in all the blank date with undef
	}
	return \@cal;
}

sub _loadModule {
	my $self = shift;
	my $name = shift;
	$name =~ s|::|/|g;
	require "$name.pm";
	return 1;
}

1;
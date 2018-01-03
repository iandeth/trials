package Mints::Controller::Tools::DateTime;
use base Mints::Controller::Tools;
use strict;
use Time::Local;
our $VERSION = '1.02';

### /* 定数設定 */ ###
my @DEF_MDAYS = (0,31,28,31,30,31,30,31,31,30,31,30,31);
my @DEF_WE = ('Sun','Mon','Tue','Wed','Tur','Fri','Sat');
my @DEF_WJ = ('日','月','火','水','木','金','土');

=head1 DATE FORMAT

【日付フォーマットの指定】

 YYYY:年4桁	MM:月2桁	DD:日2桁
 YY:年2桁	M:月(0サプレス無し)	D:日(0サプレス無し)
 YJ:元号+年	WE:英語表記の曜日(Sun,Mon・・・)	WJ:日本語表記の曜日(日,月・・・)
 フォーマットが2バイト文字なら、置き換わるのも2バイト文字

 ex)
 フォーマット           戻り値
 ---------------------  -----------------------
 (No Format)            20020117
 YYYY/MM/DD             2002/01/17
 YYYY年MM月DD日         2002年01月17日
 ＹＹＹＹ年Ｍ月Ｄ日     ２００２年１月１７日
 YYYY年M月D日           2002年1月17日
 YYYY/MM/DD WE          2002/01/17 Wed
 YYYY年MM月DD日（WJ）   2002年01月17日（水）
 YJ年MM月DD日           平成14年01月17日


=head1 TIME FORMAT

【時間フォーマットの指定】

 HH:時2桁	MI:分2桁	SS:秒2桁
 H:時(0サプレス無し)	M:分(0サプレス無し)	S:秒(0サプレス無し)
 フォーマットが2バイト文字なら、置き換わるのも2バイト文字

 ex)
 フォーマット           戻り値
 ---------------------  -----------------------
 (No Format)            113847
 HH:MI:SS               11:38:47
 H時M分S秒              11時38分47秒
 ＨＨ時ＭＭ分ＳＳ秒     １１時３８分４７秒

=cut

#-------------------------------------------------------------------------------
# 現在日付・時間を取得
# 引数1：日付フォーマット（option）なしの場合は、'YYYYMMDD'
# 引数2：時間フォーマット（option）なしの場合は、'HHMISS'
# 戻り値1：日付
# 戻り値2：時間
#-------------------------------------------------------------------------------
sub sysDateTime {
	my $class = shift;
	my($datefmt,$timefmt) = @_;
	my($sec,$min,$hour,$day,$mon,$year) = localtime(time);
	$mon++;
	$year += 1900;
	$day = sprintf('%02d',$day);
	$mon = sprintf('%02d',$mon);
	$year = sprintf('%04d',$year);
	$sec = sprintf('%02d',$sec);
	$min = sprintf('%02d',$min);
	$hour = sprintf('%02d',$hour);
	$datefmt = 'YYYYMMDD' unless $datefmt;
	$timefmt = 'HHMISS' unless $timefmt;
	return ($class->format("$year$mon$day",$datefmt).$class->format("$hour$min$sec",$timefmt));
}

#-------------------------------------------------------------------------------
# 現在日付を取得
# 引数：日付フォーマット（option）  なしの場合は、'YYYYMMDD'
#-------------------------------------------------------------------------------
sub sysdate {
	my $class = shift;
	my($fmt) = @_;
	my($day,$mon,$year) = (localtime)[3,4,5];
	$mon++;
	$year += 1900;
	$fmt = 'YYYYMMDD' unless $fmt;
	$day = sprintf('%02d',$day);
	$mon = sprintf('%02d',$mon);
	$year = sprintf('%04d',$year);
	return $class->format("$year$mon$day",$fmt);
}

#-------------------------------------------------------------------------------
# 現在時刻を取得
# 引数：時間フォーマット（option）  なしの場合は、'HHMISS'
#-------------------------------------------------------------------------------
sub systime {
	my $class = shift;
	my($fmt) = @_;
	my($sec,$min,$hour) = localtime(time);
	$fmt = 'HHMISS' unless $fmt;
	$sec = sprintf('%02d',$sec);
	$min = sprintf('%02d',$min);
	$hour = sprintf('%02d',$hour);
	return $class->format("$hour$min$sec",$fmt);
}

#-------------------------------------------------------------------------------
# 現在の年を取得
# 引数：なし
#-------------------------------------------------------------------------------
sub year {
	my $class = shift;
	my ($year) = (localtime)[5];
	$year += 1900;
	$year = sprintf('%04d',$year);
	return $year;
}

#-------------------------------------------------------------------------------
# 現在の月を取得
# 引数：なし
#-------------------------------------------------------------------------------
sub month {
	my $class = shift;
	my ($mon) = (localtime)[4];
	$mon += 1;
	$mon = sprintf('%02d',$mon);
	return $mon;
}

#-------------------------------------------------------------------------------
# 現在の日を取得
# 引数：なし
#-------------------------------------------------------------------------------
sub day {
	my $class = shift;
	my ($day) = (localtime)[3];
	$day = sprintf('%02d',$day);
	return $day;
}

#-------------------------------------------------------------------------------
# 日付・時刻をフォーマット
# 引数1：YYYYMMDD or HHMISS
# 引数2：日付フォーマット or 時間フォーマット
# 戻値：フォーマット後日付 or 時刻
#-------------------------------------------------------------------------------
sub format {
	my $class = shift;
	my($src,$fmt) = @_;
	if(length($src) == 8){
		$fmt = $class->_date_format($src,$fmt);
	}elsif(length($src) == 6){
		$fmt = $class->_time_format($src,$fmt);
	}
	return $fmt;
}

#-------------------------------------------------------------------------------
# 日付フォーマット
#-------------------------------------------------------------------------------
sub _date_format {
	my $class = shift;
	my ($src,$fmt) = @_;
	my %TMP;
	my($year,$mon,$day) = unpack('a4a2a2',$src);
	my($yj) = $class->to_jyear($year);
	my($we) = $class->wday($_[0]);
	@TMP{('YYYY','MM','DD','YJ')} = ($year,$mon,$day,$yj);
	$fmt = $class->_Fmtdate($fmt,\%TMP);
	undef %TMP;
	$year = substr($year,2,2);
	$mon += 0;
	$day += 0;
	@TMP{('YY','M','D')} = ($year,$mon,$day);
	$fmt = $class->_Fmtdate($fmt,\%TMP);
	undef %TMP;
	@TMP{('WE','WJ')} = ($DEF_WE[$we],$DEF_WJ[$we]);
	return $class->_Fmtdate($fmt,\%TMP);
}

#-------------------------------------------------------------------------------
# 時間フォーマット
#-------------------------------------------------------------------------------
sub _time_format {
	my $class = shift;
	my ($src,$fmt) = @_;
	my %TMP;
	my($hour,$min,$sec) = unpack('a2a2a2',$src);
	@TMP{('HH','MI','SS')} = ($hour,$min,$sec);
	$fmt = $class->_Fmtdate($fmt,\%TMP);
	undef %TMP;
	$hour += 0;
	$min += 0;
	$sec += 0;
	@TMP{('H','M','S')} = ($hour,$min,$sec);
	$fmt = $class->_Fmtdate($fmt,\%TMP);
}

#-------------------------------------------------------------------------------
# フォーマット関数
#-------------------------------------------------------------------------------
sub _Fmtdate {
	my $class = shift;
	my($fmt,$p) = @_;
	my($match,$tostr);
	foreach $match (keys %{$p}){
		$tostr = $p->{$match};
		$fmt =~ s/$match/$tostr/g;
		$fmt =~ s/$match/$tostr/g;
	}
	return $fmt;
}

#-------------------------------------------------------------------------------
# 日付を操作
# 引数1：YYYYMMDD
# 引数2：加算日
# 戻値：加算後日付
#-------------------------------------------------------------------------------
sub add_day {
	my $class = shift;
	my($ymd,$add_d) = @_;
	my($ym,$day) = unpack('a6a2',$ymd);
	my($mdays);
	$day += $add_d;
	$mdays = $class->mdays($ym);
	while($day > $mdays){
		$day -= $mdays;
		$ym = $class->add_month($ym,1);
		$mdays = $class->mdays($ym);
	}
	while($day < 1){
		$ym = $class->add_month($ym,-1);
		$mdays = $class->mdays($ym);
		$day += $mdays;
	}
	return $ym.sprintf('%02d',$day);
}

#-------------------------------------------------------------------------------
# 月を操作
# 引数１：YYYYMMDD
# 引数２：加算月
# 戻値：加算後日付
#-------------------------------------------------------------------------------
sub add_month {
	my $class = shift;
	my($ymd,$add_m) = @_;
	my($year,$mon,$day) = unpack('a4a2a2',$ymd);
	my($mdays);
	$mon += $add_m;
	while($mon > 12){
		$mon -= 12;
		$year++;
	}
	while($mon < 1){
		$mon += 12;
		$year--;
	}
	$mon = sprintf('%02d',$mon);
	$mdays = $class->mdays($year.$mon);
	$day = $mdays if($day > $mdays);
	return $year.$mon.$day;
}

#-------------------------------------------------------------------------------
# 年を操作
# 引数１：YYYYMMDD
# 引数２：加算年
# 戻値：加算後日付
#-------------------------------------------------------------------------------
sub add_year {
	my $class = shift;
	my($ymd,$add_y) = @_;
	my($year,$mon,$day) = unpack('a4a2a2',$ymd);
	$year += $add_y;
	# 閏年以外で2/29なら2/28へ
	$day = '28' if(!$class->is_leap($year) && $mon eq '02' && $day eq '29');
	return $year.$mon.$day;
}

#-------------------------------------------------------------------------------
# 秒を操作
# 引数1：YYYYMMDDHHMISS
# 引数2：加算秒
# 戻値：加算後時間
#-------------------------------------------------------------------------------
sub add_second {
	my $class = shift;
	my($ymdhms,$add_s) = @_;
	my ($year,$month,$day,$hour,$min,$sec) = unpack('a4a2a2a2a2a2',$ymdhms);
	my $epoch = timelocal($sec,$min,$hour,$day,$month-1,$year-1900);
	$epoch += $add_s;
	($sec,$min,$hour,$day,$month,$year) = (localtime($epoch))[0,1,2,3,4,5];
	return sprintf("%04d%02d%02d%02d%02d%02d", $year+1900, $month+1, $day, $hour, $min, $sec);
}

#-------------------------------------------------------------------------------
# 月の日数を返す
#-------------------------------------------------------------------------------
sub mdays {
	my $class = shift;
	my($year,$mon) = unpack('a4a2',$_[0]);
	$mon = int($mon);
	if($mon == 2 && $class->is_leap($year)){
		return 29;
	}else{
		return $DEF_MDAYS[$mon];
	}
}

#-------------------------------------------------------------------------------------
# 日付判定
# 引数1：文字列
# 戻り値：真偽値
#-------------------------------------------------------------------------------------
sub is_date {
	my $class = shift;
	my($val) = shift;
	my($y,$m,$d) = unpack('a4a2a2',$val);
	return 1 unless $val;
	if($val !~ /^\d{8}$/ || $m < 1 || 12 < $m || $d < 1 || $class->days("$y$m") < $d){
		return 0;
	} else {
		return 1;
	}
}

#-------------------------------------------------------------------------------
# 閏年判定
#-------------------------------------------------------------------------------
sub is_leap {
	my $class = shift;
	my($year) = @_;
	return ((($year % 4) == 0 && ($year % 100) != 0) || ($year % 400) == 0)
}

#-------------------------------------------------------------------------------
# 西暦 => 和暦 変換
#-------------------------------------------------------------------------------
sub to_jyear {
	my $class = shift;
	my($year) = @_;
	my($gengo);
	if($year < 1867){
		warn qq("DateTime->to_jyear: '$year'年（明治以前）は未対応です。");
	}elsif($year < 1911){
		$gengo = '明治';
		$year -= 1867;
	}elsif($year < 1925){
		$gengo = '大正';
		$year -= 1911;
	}elsif($year < 1988){
		$gengo = '昭和';
		$year -= 1925;
	}else{
		$gengo = '平成';
		$year -= 1988;
	}
	$year = '元' if($year == 0);
	return "$gengo$year";
}

#-------------------------------------------------------------------------------
# 曜日取得
# 引数：YYYYMMDD
# 戻値：0 => 日、1 => 月 ... 6 => 土
#-------------------------------------------------------------------------------
sub wday {
	my $class = shift;
	my($year,$mon,$day) = unpack('a4a2a2',$_[0]);
	if($mon <= 2){
		$year--;
		$mon += 12;
	}
	return ($year + int($year / 4) - int($year / 100) + int($year / 400) + int(2.6 * $mon + 1.6) + $day) % 7;
}

#-------------------------------------------------------------------------------
# カレンダー構造体を作成
# 指定した月のカレンダー構造体（各週->各日にちの二次元配列）を返す関数。
# 引数１：年月  [YYYYMM]
# 引数２：週最後の曜日設定フラグ -> 0/null : 土曜日 1 : 日曜日
# 戻り値：各週->各日にち の構造体（二次元配列）のリファレンス（pointer）
#-------------------------------------------------------------------------------
sub calendar {
	my $class = shift;
	my($YYYYMM,$flg) = (substr($_[0],0,6),$_[1]);
	### error check ###
	if(length($YYYYMM) != 6 || $YYYYMM =~ /[^0-9]/){
		die "mints datetime calendar : wrong format >YYYYMM";
	}
	### end of the week = sunday or saturday? ###
	# 0 : sunday / 6: saturday
	my $end_day = ($flg)? 0 : 6;
	### get days in month ###
	my ($y,$m)	= unpack("a4a2",$YYYYMM);
	my $days_in_m = $class->mdays($y.$m);
	### define the first sunday/saturday ###
	my($w,$d,$now,@cal);
	for $d (1 .. 7){
		$w = $class->wday("$y$m$d");         # define which day of the week
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
	for $d ($now+1 .. $days_in_m){
		push(@{$cal[$i]},sprintf("%02d",$d)); # create $cal[$i]->[] object
		$i++ if($class->wday("$y$m$d") eq $end_day); # move to next week if the date = sunday/saturday
	}
	### organize the last week array ###
	while ($#{$cal[$#cal]} < 6){
		push(@{$cal[$#cal]},undef); # fill in all the blank date with " "
	}
	return \@cal;
}

1;

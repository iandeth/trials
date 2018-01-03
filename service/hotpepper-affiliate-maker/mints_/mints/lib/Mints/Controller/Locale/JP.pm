package Mints::Controller::Locale::JP;
use base Mints::Controller::Locale;
use strict;
our $VERSION = '0.05';

sub forToolsEncode {
	my $class = shift;
	return {
		suspects => [qw(euc-jp shiftjis iso-2022-jp)],
	};
}

sub forHttp {
	my $class = shift;
	my $smap = $class->SUPER::forHttp;
	return {
		%{ $smap },
		'shiftjis'  => 'SHIFT_JIS',
		'cp932'     => 'SHIFT_JIS',
		'euc-jp'    => 'EUC-JP',
	};
}

sub forMail {
	my $class = shift;
	return {
		encoding     => '7bit-jis',
		charset      => 'iso-2022-jp',
	};
}

sub forValidation {
	my $class = shift;
	return {
		match_error       => '値が正しくありません',
		enum_error        => '値が正しくありません',
		compare_error     => '値が正しくありません',
		custom_error      => '値が正しくありません',
		equals_error      => '値が正しくありません',
		required_error    => '必須入力項目です',
		required_if_error => '必須入力項目です',
		max_values_error  => '最大$value個までです',
		min_values_error  => '最低$value個必要です',
		min_in_set_error  => '選択個数が足りません',
		max_in_set_error  => '選択個数が多すぎます',
		min_len_error     => '最低$value文字必要です',
		max_len_error     => 'は最大$value文字までです',
		no_extra_fields_error => '想定されていない入力項目です',
	};
}

sub forDateTime {
	my $class = shift;
	return {
		locale => 'ja',
	};
}

sub forMySQL {
	my $class = shift;
	my $smap = $class->SUPER::forMySQL;
	return {
		%{ $smap },
		'shiftjis'  => 'sjis',
		'cp932'     => 'cp932',
		'euc-jp'    => 'ujis',
	};
}

sub fromTo_preHook {
	my $class = shift;
	my ($from,$to) = ($_[1],$_[2]);
	# UTF8の際のCP932対策 (Win端末からの入力時対策)
	if($from eq 'utf8' && $to eq 'iso-2022-jp'){
		my @map = (
			{
				name => '全角ニョロ',
				from => "\xef\xbd\x9e",
				to   => "\xe3\x80\x9c",
			},
			{
				name => '全角ハイフン',
				from => "\xef\xbc\x8d",
				to   => "\xe2\x88\x92",
			},
			{
				name => '全角二重縦棒',
				from => "\xe2\x88\xa5",
				to   => "\xe2\x80\x96",
			},
			{
				name => '通貨記号セント',
				from => "\xef\xbf\xa0",
				to   => "\xc2\xa2",
			},
			{
				name => '通貨記号ユーロ',
				from => "\xef\xbf\xa1",
				to   => "\xc2\xa3",
			},
		);
		foreach (@map){
			$_[0] =~ s{$_->{from}}{$_->{to}}g;
		}
	}
	return 1;
}

1;
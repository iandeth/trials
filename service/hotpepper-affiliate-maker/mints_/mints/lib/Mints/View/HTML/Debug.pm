package Mints::View::HTML::Debug;
use strict;
use warnings;
our $VERSION = '0.02';

=head1 NAME

utility module - HTML::Debug -
2002/11/01 by T.Ishibashi

=head1 CONTENTS

=over

=item *

DEBUG HTML出力 : Dump()

=item *

HTMLの文字参照に置換する : TrSym()

=item *

行末改行CODEを除去 : Chomp()

=item *

改行CODEをすべて除去 : RmvR()

=back

=cut

sub new {
	my $class = shift;
	return bless({
		refs => {}, # for checking re-used addresses
	},$class);
}


### DEBUG用TABLEをHTMLに出力[DEBUG] ###
#
# 渡されたOBJECTの中身を(SCALAR/ARRAY/HASH)すべてHTMLに出力 => 値確認用（DEBUG用）
#
# 引数１：DEBUG表示させたい (SCALAR | ARRAY | HASH) reference
# 引数２：DEBUG表示させたい項目の表題
# 引数３：DEBUG表示時[space][タブ][改行] => [x][x][r/n/rn] 変換表示機能のON/OFFフラグ（OPTIONAL）
# 引数４：DEBUG表示のフォントサイズ[1-5] (OPTIONAL)
# 引数５：第２階層以降〜判別フラグ (裏で使用)
# 戻値　：HTML text [SCALAR]
sub Dump {
	my $self = shift;
	my ($p,$title,$tr,$fs,$flg) = @_;
	my ($s,@s,%s,$i,$bgc);
	my $html = '';
	$fs = "1" if(!$fs); # FONT SIZEのdefault = 1
	
	### re-used address check
	if($self->{refs}{$p}){
		return "*** RE-USED ADDRESS *** $p";
	}
	$self->{refs}{ $p }++;
	
	### my変数セット＆文字列変換処理 ###
	if (ref($p) eq "SCALAR"){
		$s = $$p;
		$self->TrSym($s); # HTML禁止文字の変換
		$s = $self->_TrSpChar($s) if ($tr);   # [space][tab][\r\n]変換機能
	}elsif (ref($p) eq "ARRAY"){
		@s = @$p;
		foreach(@s){
			$self->TrSym($_);
			$_ = $self->_TrSpChar($_) if ($tr);
		}
	}elsif (ref($p) eq "HASH"){
		%s = %$p;
		foreach(keys %s){
			$self->TrSym($s{$_}); 
			$s{$_} = $self->_TrSpChar($s{$_}) if ($tr);
			# ↑valuesのみ変換してる点に注意！
		}
	}elsif (ref($p) eq "CODE"){
		$s = 'method';
	}else{
		### bless object の場合? ###
		my ($package,$ref) = split(/=/,$p);
		warn "$p" if(!defined($ref));
		if ($ref =~ /^SCALAR/){
			$s = $$p;
			$self->TrSym($s); # HTML禁止文字の変換
			$s = $self->_TrSpChar($s) if ($tr); # [space][tab][\r\n]変換機能
		}elsif ($ref =~ /^ARRAY/){
			@s = @$p;
			foreach(@s){
				$self->TrSym($_);
				$_ = $self->_TrSpChar($_) if ($tr);
			}
		}elsif ($ref =~ /^HASH/){
			%s = %$p;
			foreach(keys %s){
				$self->TrSym($s{$_});
				$s{$_} = $self->_TrSpChar($s{$_}) if ($tr);
				# ↑valuesのみ変換してる点に注意！
			}
		}
	}
	
	### 第一階層HTML ###
	if(!$flg){
	
		### 共通HEADER [HTML] ###
		$html .= qq(
		<table width="350" border="1" cellspacing="0" cellpadding="3" bordercolor="#666666"><tr>
		<td width="290" bgcolor="#FFFFFF" align="center"><font size=1 color="#999999">$title</font></td>
		<td bgcolor="#666666" width="60" align="center" valign="top"><font color="#FFFFFF" size=1>
		<b>DUMP</b></font></tr></table>
		);
		
		### SCALARの場合 [HTML] ###
		if ($s && $s ne ""){
			$html .= qq(
			<table width="350" border="0" cellspacing="0" cellpadding="5"><tr> 
			<td width="3%" bgcolor="#EEEEEE" align="center" valign="top"></td>
			<td bgcolor="#FFFFFF" width="97%"><font color="#000000" size=$fs>);
			
			if (ref($s)){ $html .= $self->Dump($s,"",$tr,$fs,1); }
			else{ $html .= $s; }
			
			$html .= qq(</font></td></tr></table><BR>\n);
		
		### ARRAYの場合 [HTML] ###
		}elsif (@s){
			$i = 0;
			$html .= qq(
			<table width="350" border="0" cellspacing="0" cellpadding="5"><tr> 
			<td width="3%" align="center" valign="top" bgcolor="#EEEEEE"></td>
			<td width="97%" bgcolor="#FFFFFF"><table width="100%" border="0" cellspacing="0" cellpadding="3">\n);
			foreach (@s){
				if($i%2 == 0){ $bgc = "#EEEEEE"; }else{ $bgc = "#FFFFFF"; }
				$html .= qq(
				<tr><td width="10%" bgcolor="$bgc" align=center valign=top><b>
				<font color="#000000" size=$fs>$i</font><td>
				<td width="90%" bgcolor="$bgc"><font color="#000000" size=$fs>);
				
				if (ref($_)){ $html .= $self->Dump($_,"",$tr,$fs,1); }
				else{ $html .= $_; }
				
				$html .= qq(</font></td></tr>);
				$i++;
			}
			$html .= qq(\n</table></td></tr></table><BR>\n);
		
		### HASHの場合 [HTML] ###
		}elsif (%s){
			$i = 0;
			$html .= qq(
			<table width="350" border="0" cellspacing="0" cellpadding="5"><tr> 
			<td width="3%" align="center" valign="top" bgcolor="#EEEEEE"></td>
			<td width="97%" bgcolor="#FFFFFF"><table width="100%" border="0" cellspacing="0" cellpadding="3">\n);
			foreach (sort {$a cmp $b} keys %s){
				if($i%2 == 0){ $bgc = "#EEEEEE"; }else{ $bgc = "#FFFFFF"; }
				$html .= qq(
				<tr><td width="20%" bgcolor="$bgc" valign=top><b><font color="#000000" size=$fs>$_</font></b></td>
				<td width="80%" bgcolor="$bgc"><font color="#000000" size=$fs>);
				
				if (ref($s{$_})){ $html .= $self->Dump($s{$_},"",$tr,$fs,1); }
				else{ $html .= $s{$_}; }
			   
				$html .= qq(</font></td></tr>);
				$i++;
			}
			$html .= qq(\n</table></td></tr></table><BR>\n);
		
		### ポインタ以外の場合 [HTML] ###
		}else{
			$html .= qq(<BR><font color="#000000" size=$fs>　エラー : ポインタが
			正しく渡されてないか、データが空だぜー</font><BR><BR>);
		}
		
	### 第２階層以降〜HTML ###
	}else{
		### SCALARの場合 [HTML] ###
		if ($s){ 
			$html .= qq(
			<table width="100%" border="0" cellpadding="0"><tr><td width="3" 
			bgcolor="#CCCCCC"><font size=1 color="#CCCCCC">x</font></td><td>
			<table cellspacing=0 cellpadding=0 width="100%" border=0><tr><td colspan="2"><font 
			color="#999999" size="1">$p</font></td></tr>
			<tr><td colspan="2"><font color="#000000" size=$fs>$s</font></td></tr>
			</table></td></tr></table>);
		
		### ARRAYの場合 [HTML] ###
		}elsif(@s){
			$html .= qq(
			<table width="100%" border="0" cellpadding="0"><tr><td width="3" 
			bgcolor="#CCCCCC"><font size=1 color="#CCCCCC">x</font></td><td>
			<table cellspacing=0 cellpadding=0 width="100%" border=0><tr><td colspan="2"><font 
			color="#999999" size="1">$p</b></font></td></tr></table>
			<table cellspacing=0 cellpadding=3 width="100%" border=0>);
			$i = 0;
			foreach(@s){
				$html .= qq(
				<tr><td width="10%" valign=top><b><font color="#000000" size=$fs>$i</font></b></td>
				<td width="90%"><font color="#000000" size=$fs>);
				
				if (ref($_)){ $html .= $self->Dump($_,"",$tr,$fs,1); }
				else{ $html .= $_; }
				
				$html .= qq(</font></td></tr>);
				$i++;
			}
			$html .= qq(\t\t\t\t</table></td></tr></table>);
		
		### HASHの場合 [HTML] ###
		}elsif(%s){
			$html .= qq(
			<table width="100%" border="0" cellpadding="0"><tr><td width="3" 
			bgcolor="#CCCCCC"><font size=1 color="#CCCCCC">x</font></td><td>
			<table cellspacing=0 cellpadding=0 width="100%" border=0><tr><td colspan="2"><font 
			color="#999999" size="1">$p</b></font></td></tr></table>
			<table cellspacing=0 cellpadding=3 width="100%" border=0>);
			foreach (sort {$a cmp $b} keys %s){
				$html .= qq(
				<tr><td width="20%" valign=top><b><font color="#000000" size=$fs>$_</font></b></td>
				<td width="80%"><font color="#000000" size=$fs>);
				
				if (ref($s{$_})){ $html .= $self->Dump($s{$_},"",$tr,$fs,1); }
				else{$html .= $s{$_}; }
				
				$html .= qq(</font></td></tr>);
			}
			$html .= qq(\t\t\t\t</table></td></tr></table>);
		}
	}
	return $html;
}

### HTMLの文字参照に置換する ###
#
# [&][<][>]["]をそれぞれHTML表示用に文字置換する
# 
# 引数：文字列
# 戻値：無し
sub TrSym {
	my $self = shift;
	return if(!$_[0]);
	$_[0] =~ s/&/&amp;/g; # これを一番先に置換しないと後の３つの意味がない
	$_[0] =~ s/</&lt;/g;
	$_[0] =~ s/>/&gt;/g;
	$_[0] =~ s/"/&quot;/g;
	return;
}

### 行末改行CODEを除去 ###
#
# CR / LF / CRLF 全部に対応
# 
# 引数：文字列
# 戻値：無し
sub Chomp {
	my $self = shift;
	my $default = $/;   # 元の改行CODE型を記憶
	$/ = "\r";		  # CR
	chomp $_[0];
	$/ = "\n";		  # LF
	chomp $_[0];
	$/ = "\r\n";		# CRLF
	chomp $_[0];
	$/ = $default;	  # 元の改行CODE型を戻す
	return;
}

### 改行CODEをすべて除去 ###
#
# CR / LF / CRLF 全部に対応
#
# 引数：文字列[SCALAR]
# 戻値：無し
sub RmvR {
	$_[0] =~ s/[\r\n]//g;
	return;
}

### 文字列中の半角space/tab/改行をHTML表示用文字列に変換 ###
#
# 文字列中の半角space/tab/改行をそれぞれ x/x(青色)/r,n,rn(赤色）に変換する
# ポイントは改行コードが\r/\n/\r\nのどれか識別して表示されるトコロ。
#
# 引数１：文字列 [SCALAR]
# 戻値　：文字列 [SCALAR]
sub _TrSpChar {
	my $self = shift;
	my $s = $_[0];
	$s =~ s/ /<font color\=#999999>x<\/font>/g; # space   -> [x] (色は灰）
	$s =~ s/\t/<font color\=#0066FF>x<\/font>/g; # tab	-> [x] (色は青）
	$s =~ s/\r\n/<font color\=#990000> rn <\/font>/g; # \r\n改行   -> [ rn ] (色は赤）
	$s =~ s/\r/<font color\=#990000> r <\/font>/g; # \r改行   -> [ r ] (色は赤）
	$s =~ s/\n/<font color\=#990000> n <\/font>/g; # \n改行   -> [ n ] (色は赤）
	return $s;
}

### END OF SCRIPT.
1;

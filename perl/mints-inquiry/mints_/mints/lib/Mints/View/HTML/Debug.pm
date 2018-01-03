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

DEBUG HTML���� : Dump()

=item *

HTML��ʸ�����Ȥ��ִ����� : TrSym()

=item *

��������CODE����� : Chomp()

=item *

����CODE�򤹤٤ƽ��� : RmvR()

=back

=cut

sub new {
	my $class = shift;
	return bless({
		refs => {}, # for checking re-used addresses
	},$class);
}


### DEBUG��TABLE��HTML�˽���[DEBUG] ###
#
# �Ϥ��줿OBJECT����Ȥ�(SCALAR/ARRAY/HASH)���٤�HTML�˽��� => �ͳ�ǧ�ѡ�DEBUG�ѡ�
#
# ��������DEBUGɽ���������� (SCALAR | ARRAY | HASH) reference
# ��������DEBUGɽ�������������ܤ�ɽ��
# ��������DEBUGɽ����[space][����][����] => [x][x][r/n/rn] �Ѵ�ɽ����ǽ��ON/OFF�ե饰��OPTIONAL��
# ��������DEBUGɽ���Υե���ȥ�����[1-5] (OPTIONAL)
# ���������裲���ذʹߡ�Ƚ�̥ե饰 (΢�ǻ���)
# ���͡���HTML text [SCALAR]
sub Dump {
	my $self = shift;
	my ($p,$title,$tr,$fs,$flg) = @_;
	my ($s,@s,%s,$i,$bgc);
	my $html = '';
	$fs = "1" if(!$fs); # FONT SIZE��default = 1
	
	### re-used address check
	if($self->{refs}{$p}){
		return "*** RE-USED ADDRESS *** $p";
	}
	$self->{refs}{ $p }++;
	
	### my�ѿ����åȡ�ʸ�����Ѵ����� ###
	if (ref($p) eq "SCALAR"){
		$s = $$p;
		$self->TrSym($s); # HTML�ػ�ʸ�����Ѵ�
		$s = $self->_TrSpChar($s) if ($tr);   # [space][tab][\r\n]�Ѵ���ǽ
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
			# ��values�Τ��Ѵ����Ƥ�������ա�
		}
	}elsif (ref($p) eq "CODE"){
		$s = 'method';
	}else{
		### bless object �ξ��? ###
		my ($package,$ref) = split(/=/,$p);
		warn "$p" if(!defined($ref));
		if ($ref =~ /^SCALAR/){
			$s = $$p;
			$self->TrSym($s); # HTML�ػ�ʸ�����Ѵ�
			$s = $self->_TrSpChar($s) if ($tr); # [space][tab][\r\n]�Ѵ���ǽ
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
				# ��values�Τ��Ѵ����Ƥ�������ա�
			}
		}
	}
	
	### ��쳬��HTML ###
	if(!$flg){
	
		### ����HEADER [HTML] ###
		$html .= qq(
		<table width="350" border="1" cellspacing="0" cellpadding="3" bordercolor="#666666"><tr>
		<td width="290" bgcolor="#FFFFFF" align="center"><font size=1 color="#999999">$title</font></td>
		<td bgcolor="#666666" width="60" align="center" valign="top"><font color="#FFFFFF" size=1>
		<b>DUMP</b></font></tr></table>
		);
		
		### SCALAR�ξ�� [HTML] ###
		if ($s && $s ne ""){
			$html .= qq(
			<table width="350" border="0" cellspacing="0" cellpadding="5"><tr> 
			<td width="3%" bgcolor="#EEEEEE" align="center" valign="top"></td>
			<td bgcolor="#FFFFFF" width="97%"><font color="#000000" size=$fs>);
			
			if (ref($s)){ $html .= $self->Dump($s,"",$tr,$fs,1); }
			else{ $html .= $s; }
			
			$html .= qq(</font></td></tr></table><BR>\n);
		
		### ARRAY�ξ�� [HTML] ###
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
		
		### HASH�ξ�� [HTML] ###
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
		
		### �ݥ��󥿰ʳ��ξ�� [HTML] ###
		}else{
			$html .= qq(<BR><font color="#000000" size=$fs>�����顼 : �ݥ��󥿤�
			�������Ϥ���Ƥʤ������ǡ�������������</font><BR><BR>);
		}
		
	### �裲���ذʹߡ�HTML ###
	}else{
		### SCALAR�ξ�� [HTML] ###
		if ($s){ 
			$html .= qq(
			<table width="100%" border="0" cellpadding="0"><tr><td width="3" 
			bgcolor="#CCCCCC"><font size=1 color="#CCCCCC">x</font></td><td>
			<table cellspacing=0 cellpadding=0 width="100%" border=0><tr><td colspan="2"><font 
			color="#999999" size="1">$p</font></td></tr>
			<tr><td colspan="2"><font color="#000000" size=$fs>$s</font></td></tr>
			</table></td></tr></table>);
		
		### ARRAY�ξ�� [HTML] ###
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
		
		### HASH�ξ�� [HTML] ###
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

### HTML��ʸ�����Ȥ��ִ����� ###
#
# [&][<][>]["]�򤽤줾��HTMLɽ���Ѥ�ʸ���ִ�����
# 
# ������ʸ����
# ���͡�̵��
sub TrSym {
	my $self = shift;
	return if(!$_[0]);
	$_[0] =~ s/&/&amp;/g; # ������������ִ����ʤ��ȸ�Σ��Ĥΰ�̣���ʤ�
	$_[0] =~ s/</&lt;/g;
	$_[0] =~ s/>/&gt;/g;
	$_[0] =~ s/"/&quot;/g;
	return;
}

### ��������CODE����� ###
#
# CR / LF / CRLF �������б�
# 
# ������ʸ����
# ���͡�̵��
sub Chomp {
	my $self = shift;
	my $default = $/;   # ���β���CODE���򵭲�
	$/ = "\r";		  # CR
	chomp $_[0];
	$/ = "\n";		  # LF
	chomp $_[0];
	$/ = "\r\n";		# CRLF
	chomp $_[0];
	$/ = $default;	  # ���β���CODE�����᤹
	return;
}

### ����CODE�򤹤٤ƽ��� ###
#
# CR / LF / CRLF �������б�
#
# ������ʸ����[SCALAR]
# ���͡�̵��
sub RmvR {
	$_[0] =~ s/[\r\n]//g;
	return;
}

### ʸ�������Ⱦ��space/tab/���Ԥ�HTMLɽ����ʸ������Ѵ� ###
#
# ʸ�������Ⱦ��space/tab/���Ԥ򤽤줾�� x/x(�Ŀ�)/r,n,rn(�ֿ��ˤ��Ѵ�����
# �ݥ���Ȥϲ��ԥ����ɤ�\r/\n/\r\n�Τɤ줫���̤���ɽ�������ȥ���
#
# ��������ʸ���� [SCALAR]
# ���͡���ʸ���� [SCALAR]
sub _TrSpChar {
	my $self = shift;
	my $s = $_[0];
	$s =~ s/ /<font color\=#999999>x<\/font>/g; # space   -> [x] (���ϳ���
	$s =~ s/\t/<font color\=#0066FF>x<\/font>/g; # tab	-> [x] (�����ġ�
	$s =~ s/\r\n/<font color\=#990000> rn <\/font>/g; # \r\n����   -> [ rn ] (�����֡�
	$s =~ s/\r/<font color\=#990000> r <\/font>/g; # \r����   -> [ r ] (�����֡�
	$s =~ s/\n/<font color\=#990000> n <\/font>/g; # \n����   -> [ n ] (�����֡�
	return $s;
}

### END OF SCRIPT.
1;

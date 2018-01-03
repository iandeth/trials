package DevTest::Test;
use base Mints::Model;
use strict;
#use Smart::Comments;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	#$ctrl->setError('gugug');
	$self->{gaga} = 1;
	$self->{xx} = q(日本語表示 let's);
	$self->{yy} = [qw(a b c)];
	$self->{zz} = $ctrl->{in}{hoge};
	$ctrl->{in}{ga} = 'gaZ';
	$ctrl->{in}{fa} = '<b>fafa</b>';
	$self->{vv} = $ctrl->{in}{ga};
	$self->{xss}{str} = '<b>hogehoge</b>';
	$ctrl->setCookie(name=>'oge', value=>'xx', expires=>'-1M');
	$ctrl->setCookie(name=>'fuga', value=>'あいう');
	$ctrl->setViewOptions(NoAttr => 1);
	require Apache::Session::Generate::MD5;
	$self->{ses} = Apache::Session::Generate::MD5::generate;
	#$ctrl->redispatch('Test/Desu');
	### hoge...
	my %a = ( a=>1, b=>2 );
	### fuga : %a
	### x: $ctrl->{adm}
	$self->{zero} = 0;
	$self->{reused} = $self;
}

sub fuga {
	my $self = shift;
	return $self;
}

1;
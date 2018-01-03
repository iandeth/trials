package DevTestSjis::Basic;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	#$ctrl->{adm}{execEnv} = 'web';
	$ctrl->setCookie(name=>'hoge', value=>'あ');
	$self->{hoge} = '変数表示';
	$ctrl->{in}{fuga} = '<b>秘密表示';
	if($ctrl->{in}{die}){
		die '日本語エラー';
	}
	if($ctrl->{in}{mail}){
		$self->{mailok} = $ctrl->sendMail(
			to      => q("日本語です" <iandeth99@ybb.ne.jp>),
			from    => q("地図帳J" <jmap@tatamilab.jp>),
			subject => "日本語表示です",
		);
	}
}

1;
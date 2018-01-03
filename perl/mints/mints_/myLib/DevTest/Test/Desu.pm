package DevTest::Test::Desu;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$self->{a} = {
		b => [ qw(1 2 3) ],
		c => 'シィなんです',
		d => 'd',
	};
	$self->{mailok} = $ctrl->sendMail(
		to      => q("日本語です" <webadm@localhost>),
		from    => q("地図帳J" <jmap@tatamilab.jp>),
		subject => "日本語表示です",
	);
	
#	$self->{mailok} = $ctrl->sendMail(
#		to => q("hoge" <webadm@localhost>),
#		from => q("mints" <mints@localhost>),
#		subject => "mail sent by mints",
#		message => "hoge hoge\nfuga fuga",
#	);

}

sub hoge {
	my $self = shift;
	return 'hogehoge';
}

1;
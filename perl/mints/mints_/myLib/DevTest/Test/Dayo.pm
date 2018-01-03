package DevTest::Test::Dayo;
use base Mints::Model;
use strict;

sub handler {
	my $self = shift;
	my $ctrl = shift;
	$ctrl->returnFileDownload(
		fileName => 'gaga.txt',
		readFile => 'Test/Dayo.txt',
	);
	return 1;
}

1;
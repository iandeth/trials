package Mints::Controller::Tools;
use base Apache::Singleton;
use strict;
our $VERSION = '0.01';

# Tool initialization method
# runs once per process in cgi-script,
# runs once per request in mod_perl
sub _new_instance {
	my $class = shift;
	my $ctrl  = shift;
	# do your preparation here
	# i.e. 'require FooModule'
	# and return a blessed object
	return bless({},$class);
}

1;
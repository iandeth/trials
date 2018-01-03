# -*- perl -*-

# t/001_load.t - check module loading and create testing directory

use Test::More tests => 2;

BEGIN { use_ok( 'Mints' ); }

my $object = Mints->new ();
isa_ok ($object, 'Mints');



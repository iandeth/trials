use strict;
use warnings;

use lib "../../../cpanLib";
use lib "../../../mints/lib";
use lib "../../../myLib";
use FindBin;
use Mints;

open (STDOUT,'>test.html');


use Test::More tests => 6;

my $ctrl;

$::ENV{SCRIPT_NAME} = 'test.cgi';
$::ENV{DOCUMENT_ROOT} = 1;
$::ENV{PATH_INFO} = '/MyApp/Input';
$::ENV{QUERY_STRING} = 'a=11&b=23';

$ctrl = Mints->new()->exec(datDir => $FindBin::RealBin.'/../../../myDat/MyApp');


#use Dumpvalue;
#Dumpvalue->new->dumpValue($ctrl);


is($ctrl->{in}{a},11);
is($ctrl->{in}{b},23);
is($ctrl->{mdl}{a},12);

#----------------------------------------------

$::ENV{PATH_INFO} = '/MyApp/Input';
$::ENV{QUERY_STRING} = "a=$ctrl->{mdl}{a}&b=23";


$ctrl = Mints->new()->exec(datDir => $FindBin::RealBin.'/../../../myDat/MyApp');


is($ctrl->{in}{a},12);
is($ctrl->{in}{b},23);
is($ctrl->{mdl}{a},13);



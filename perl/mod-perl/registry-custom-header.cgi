#!/usr/bin/perl -w
use strict;
use CGI;
use CGI::Carp qw/fatalsToBrowser/;
use Dumpvalue;
use Apache2::Const -compile => qw/:common/;

my $r = shift;
my $q = CGI->new( $r );

$r->custom_response(
    Apache2::Const::SERVER_ERROR,
    'あいうえお',
);
# custom_response は charset 指定が効かない！
print $q->header( -status=>Apache2::Const::SERVER_ERROR, -charset=>'UTF-8' );
# print しちゃうと status が200に戻る
#$r->print( 'かきくけこ' );
return Apache2::Const::SERVER_ERROR;

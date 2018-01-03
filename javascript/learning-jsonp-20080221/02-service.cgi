#!/usr/bin/perl -w
use strict;
use CGI;

my $cgi = CGI->new;
print $cgi->header( -type=>'text/javascript', -charset=>'UTF-8' ); 
print <<"EOS";

    alert( 'あいう' );

EOS

#!/usr/bin/perl -w
use strict;
use CGI;

my $cgi = CGI->new;
print $cgi->header( -type=>'text/plain', -charset=>'UTF-8' ); 
print <<"EOS";

    {
        foo : 'あいう',
        bar : [ 1, 2, 3 ]
    }

EOS

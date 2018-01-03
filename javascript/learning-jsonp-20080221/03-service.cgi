#!/usr/bin/perl -w
use strict;
use CGI;

my $cgi = CGI->new;
print $cgi->header( -type=>'text/javascript', -charset=>'UTF-8' ); 
print <<"EOS";

    callback(
        {
            foo : 'あいう',
            bar : [ 1, 2, 3 ]
        }
    );

EOS

#!/usr/bin/perl -w
use strict;
use CGI;

my $cgi = CGI->new;
my $val = $cgi->param( 'q' ) || 'お世話になります';
print $cgi->header( -type=>'text/html', -charset=>'UTF-8' );
print <<"EOS";

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>00 ordinary web site</title>
    </head>
    <body>
    <h1>ordinary web site</h1>
    <p>$val</p>
    </body>
    </html>

EOS

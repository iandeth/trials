#!/usr/bin/perl -w
use strict;
use CGI;
use LWP::Simple qw/get/;

my $cgi = CGI->new;
print $cgi->header( -type=>'text/plain', -charset=>'UTF-8' ); 

my $url = 'http://mtl.recruit.co.jp/sandbox/toshi_i/learning-jsonp/01-service.cgi';
print get $url;

#!/usr/bin/perl -w
use strict;
use CGI;
use LWP::UserAgent;

my $q = CGI->new;
my $url = $q->param( 'url' );

if( !$url || $url !~ m{^http://www\.hotpepper\.jp/.+?\.(?:jpg|gif|png)$} ){
    print $q->header( -status=>404 );
    exit;
}

my $res = LWP::UserAgent->new( timeout=>5 )->get( $url );
print $res->headers_as_string, "\n";
print $res->content;

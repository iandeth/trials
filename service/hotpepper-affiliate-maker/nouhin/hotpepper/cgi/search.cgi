#!/usr/bin/perl -w
use strict;
use FindBin;
use lib "$FindBin::RealBin/lib";
use CGI;
use CGI::Carp qw/fatalsToBrowser/;
use JSON;
use WebService::Recruit::Alpha::Hotpepper;

my $q = CGI->new();
my $api = WebService::Recruit::Alpha::Hotpepper->new(
	api_key => 'guest' );
$api->gourmet_search( %{ $q->Vars } );
my $result = {};
if($api->is_success){
	$result->{data} = $api->get_result();
	$result->{pager} = $api->get_paging_info();
}else{
	$result->{error} = $api->get_error_msg();
}

my $json = JSON->new;
$json->keysort(1);
print "Content-Type: text/javascript; charset=UTF-8\n\n";
print $json->objToJson( $result );

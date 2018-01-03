#!/usr/bin/perl -w
use strict;
use FindBin;
use lib "$FindBin::RealBin/cpan";
use CGI qw/-oldstyle_urls/;
use URI;
use HTTP::Lite;
use Encode qw/from_to/;
umask 0002;

our $API_KEY = "1a9545d3714652d4";
our $OK_SITES = [
    qr|^http://.+?\.recruit\.co\.jp/|,
    qr|^http://.+?\.hotpepper.jp(:\d+?)?/|,
    qr|^http://demo.campaignbox.com/recruit/|,
    qr|^http://centos5/|,
];
our $REDIRECT_PAGE = 'result.html';
our $ACCESS_LOG_DIR = "$FindBin::RealBin/access_log";
# use local apache if production mode
our $API_DOMAIN = ( $::ENV{SERVER_NAME} eq 'webservice.recruit.co.jp' )?
    'localhost:8082' : 'webservice.recruit.co.jp';

# header
my $q = CGI->new;
print $q->header( -type=>'text/javascript', -charset=>'Shift_JIS' ); 

# security check
my $ok = 0;
foreach my $regexp (@{ $OK_SITES }){
    $ok++ if $::ENV{HTTP_REFERER} =~ $regexp;
}
if( !$ok ){
    send_error_response( $q, 'security error' );
    exit;
}

# debug query
#open my $fh, '>>', "/tmp/beauty-style-query.log";
#my $qs = CGI::Util::unescape( $q->query_string );
#print $fh $qs, "\n";

# api request
$q->param( 'key' => $API_KEY );
$q->param( 'vos' => 'none' );
my $uri = URI->new( 
    "http://$API_DOMAIN/beauty/style/v1/alliance?"
    . $q->query_string() );
my $http = HTTP::Lite->new;
my $stat = $http->request( $uri );
my $res  = $http->body;

# return response
if( $res =~ m{^<\?xml.+?error}xmsg || $stat != 200 ){
    send_error_response( $q, $res );
    exit;
}

# print
from_to( $res, 'utf8', 'sjis' );
print $res;

# access log
#increment_access_log();

# debug content
#open my $fh, '>>', "/tmp/beauty-style-content.log";
#print $fh $res, "\n";


# subroutine
sub send_error_response {
    my $q = shift || CGI->new;
    my $res = shift || '';
    open my $fh, '>>', "/tmp/beauty-style-alliance.error" or die $!;
    if( $fh ){
        print $fh "=========\n";
        print $fh $q->query_string(), "\n";
        print $fh $::ENV{HTTP_REFERER}, "\n";
        print $fh $res, "\n";
    }
    print "window.location.href = '$REDIRECT_PAGE'";
    return;
}

sub increment_access_log {
    require YAML::Syck;
    my ($s,$mi,$h,$d,$m,$y) = ( localtime() )[0 .. 5];
    $y += 1900; $m += 1;
    $m  = sprintf '%02d', $m;
    $d  = sprintf '%02d', $d;
    mkdir $ACCESS_LOG_DIR if !-d $ACCESS_LOG_DIR;
    my $file = "$ACCESS_LOG_DIR/$y$m.yaml";
    my $obj = {};
    if( -f $file ){
        $obj = YAML::Syck::LoadFile( $file );
    }
    $obj->{$d}++;
    YAML::Syck::DumpFile( $file, $obj );
}

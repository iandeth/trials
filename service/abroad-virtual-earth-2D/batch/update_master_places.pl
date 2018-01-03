#!/usr/bin/perl -w
use strict;
use FindBin;
use JSON;
use URI;
use LWP::Simple;
use Tie::IxHash;
our $API_KEY = '7b18731dfad050ca';
our $COUNT   = 100;

tie my %hash, 'Tie::IxHash';
my $area  = \%hash;
my $start = 1;
while (1){
    warn "requesting $start...\n";
    my $res = get_cities( $start );
    foreach my $ci ( @{$res->{city}} ){
        # area
        my $ac = $ci->{area}{code};
        if( !exists $area->{ $ac } ){
            my $count = get_area_count( $ac );
            tie my %co, 'Tie::IxHash'; 
            $area->{ $ac } = { 
                code    => $ac,
                name    => $ci->{area}{name},
                count   => $count,
                country => \%co,
            };
        }
        # country
        my $coc = $ci->{country}{code};
        if( !exists $area->{ $ac }{country}{ $coc } ){
            my $count = get_country_count( $coc );
            my $name_en = $ci->{country}{name_en};
            $name_en = '' if $name_en =~ /^\*$/;
            tie my %ci, 'Tie::IxHash';
            $area->{ $ac }{country}{ $coc } = {
                code    => $coc,
                name    => $ci->{country}{name},
                name_en => $name_en,
                count   => $count,
                city    => \%ci,
            };
        }
        # city
        my $cic = $ci->{code};
        my $name_en = $ci->{name_en};
        $name_en = '' if $name_en =~ /^\*$/;
        $area->{ $ac }{country}{ $coc }{city}{ $cic } = {
            code    => $cic,
            name    => $ci->{name},
            name_en => $name_en,
            count   => $ci->{tour_count},
            lat     => undef,
            lng     => undef,
        };
    }
    last if $start + $COUNT > $res->{results_available};
    $start += $COUNT;
}

my $file = $ARGV[0] || "$FindBin::RealBin/../js/abroad.master.places.js";
open my $fh, '>', $file or die $!;
my $json = JSON->new;
print $fh 'var ABROAD_MASTER_PLACES = ';
print $fh $json->objToJson( $area );

sub get_cities {
    my $start = shift || 1;
    my $uri = URI->new( 'http://webservice.recruit.co.jp/ab-road/city/v1/' );
    $uri->query_form(
        key    => $API_KEY,
        count  => $COUNT,
        start  => $start,
        format => 'json',
        #in_use => 0,
    );
    my $res  = get( $uri ) || die "Couldn't access the API.";
    my $root = jsonToObj( $res )->{results};
    die $root->{error}[0]{message} if $root->{error};
    return $root;
}

sub get_area_count {
    my $area_code = shift || return undef;
    my $uri = URI->new( 'http://webservice.recruit.co.jp/ab-road/area/v1/' );
    $uri->query_form(
        key    => $API_KEY,
        format => 'json',
    );
    my $res  = get( $uri ) || die "Couldn't access the API.";
    my $root = jsonToObj( $res )->{results};
    die $root->{error}[0]{message} if $root->{error};
    my $count = 0;
    foreach ( @{$root->{area}} ){
        if( $_->{code} eq $area_code ){
            $count = $_->{tour_count};
            last;
        }
    }
    return $count;
}

sub get_country_count {
    my $country_code = shift || return undef;
    my $uri = URI->new( 'http://webservice.recruit.co.jp/ab-road/country/v1/' );
    $uri->query_form(
        key     => $API_KEY,
        format  => 'json',
        country => $country_code,
    );
    my $res  = get( $uri ) || die "Couldn't access the API.";
    my $root = jsonToObj( $res )->{results};
    die $root->{error}[0]{message} if $root->{error};
    return $root->{country}[0]{tour_count} || 0;
}

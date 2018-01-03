package RWS::Fetch;
use base qw( RWS::Base );
use strict;
use Carp;
use JSON::Syck;
use LWP::Simple qw/get/;
use URI;
use Time::HiRes qw/usleep/;
our $VERSION = '0.02';

sub new {
    my $class = shift;
    my $parent = $class->SUPER::new;
    my $p = {
        %$parent,
        api       => '/ab-road/area/v1',
        base_url  => 'http://webservice.recruit.co.jp',
        key       => undef, 
        max_items => 10,
        params    => {},
        debug     => 0,
        @_,
    };
    return bless $p, $class;
}

sub fetch_all {
    my $self = shift;
    my $callback = shift || sub {};
    my $api_params = shift || {};
    my $max_items = shift || 0;
    $api_params->{start} ||= 1;
    my $count = $api_params->{count} || $self->{params}{count} || 10;
    while ( my $json = $self->fetch_once( $api_params ) ){
        my $bool = $callback->( $json );
        return if !$bool;
        # loop control
        my $start = $api_params->{start};
        $start += $count;
        last if $json->{results}{results_available} <= $start;
        last if $max_items > 0 && $start >= $max_items;
        $api_params->{start} = $start;
        # wait
        usleep 500;
    }
    return 1;
}

sub fetch_once {
    my $self = shift;
    my $ext_params = shift || {};
    my $params  = {
        format => 'json',
        key    => $self->{key},
        %{ $self->{params} },
        start  => 1,
        %{ $ext_params },
    };
    my $uri = URI->new( "$self->{base_url}$self->{api}" );
    $uri->query_form( %{ $params } );
    warn "fetching: " . $uri->as_string if $self->{debug};
    my $json = LWP::Simple::get( $uri );
    croak "LWP::Simple::get - $uri" if !$json;
    my $obj = JSON::Syck::Load( $json );
    if( !$obj ){
        croak "JSON::Syck::Load - "
            . $obj->{results}{error}[0]{message} if $obj->{results}{error};
    }
    return $obj;
}

1;

#!/usr/bin/perl -w
use strict;
use FindBin;
use URI;
use XML::TreePP;
use JSON::Syck;

# AB-ROAD 全都市名で Flickr Photo タグ検索
# >> 写真がどれ位見つかるかを調査するスクリプト

our $BASE = 'http://api.flickr.com/services/rest/';
our $KEY = '06496ddcb9f66ccceb67a3889777e539';
our $PLACES = "$FindBin::RealBin/js/abroad.master.places.js";
our $OUTPUT = $ARGV[0] || "$FindBin::RealBin/photos_per_city.dat";

my $m = {};
{
    open my $js, '<', $PLACES or die $!;
    local $/ = undef;
    my $data = <$js>;
    $m = JSON::Syck::Load( $data );
}
#use Dumpvalue; Dumpvalue->new->dumpValue( $m );
#die;

open my $out_fh, '>', $OUTPUT or die $!;
# areas
foreach my $ar_key ( keys %{ $m } ){
    my $ar = $m->{ $ar_key };
    warn "$ar->{name}\n";
    # countries
    foreach my $co_key ( keys %{ $ar->{country} } ){
        my $co = $ar->{country}{ $co_key };
        warn "    $co->{name}\n";
        # cities
        foreach my $ci_key ( keys %{ $co->{city} } ){
            my $ci = $co->{city}{ $ci_key };
            # my $keyword = $ci->{name_en} || '';
            my $keyword = $ci->{name} || '';
            # 余計なカッコを省く
            $keyword =~ s/（.+?）//g;
            # prepare REST query
            my $uri = URI->new( $BASE );
            my %hash = (
                api_key => $KEY,
                method => 'flickr.photos.search',
                sort => 'interestingness-desc',
                per_page => '1',
                tags => $keyword,
                #text => $keyword,
            );
            my $total = '-';
            my $total_cc = '-';
            if( $keyword ne '' ){
                # http request
                $uri->query_form( %hash );
                my $arr  = [qw/photo/];
                my $xp   = XML::TreePP->new( force_array => $arr );
                my $tree = $xp->parsehttp( GET => $uri->as_string );
                warn 'flickr response bad' if $tree->{rsp}{'-stat'} ne 'ok';
                my $p = $tree->{rsp}{photos};
                $total = $p->{'-total'};
                # http request - creative commons attributes
                $hash{ license } = '4,5,6';
                $uri->query_form( %hash );
                $tree = $xp->parsehttp( GET => $uri->as_string );
                warn 'flickr response bad' if $tree->{rsp}{'-stat'} ne 'ok';
                $p = $tree->{rsp}{photos};
                $total_cc = $p->{'-total'};
            }
            # CSV output
            my @cols = (
                $ar->{code},
                $ar->{name},
                $co->{code},
                $co->{name},
                $ci->{code},
                $ci->{name},
                $keyword,
                $total,
                $total_cc,
                $uri->as_string,
            );
            print $out_fh join("\t", @cols) . "\n";
            warn "        $keyword $total $total_cc\n";
        }
    }
}



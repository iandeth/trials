#!/usr/bin/perl -w
use strict;
use lib ( "$ENV{HOME}/.cpan/lib/lib/perl", 
    "$ENV{HOME}/.cpan/lib/share/perl" );
use URI;
use LWP::Simple;
use Data::Page;
use JSON::Syck;
use Imager;
use FindBin;
use File::Path;

# constants
our $KEY = '7b18731dfad050ca';
our $URL = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/';
our $COUNT = 100;
our $IMG_TMP = "$FindBin::RealBin/tmp.jpg";
our $IMG_OUT_BASE = "$FindBin::RealBin/img";
our $DAT_OUT_BASE = "$FindBin::RealBin/dat";
our $THUMB_WIDTH = 10;

# delete previous images / dat
rmtree $IMG_OUT_BASE;
mkpath $IMG_OUT_BASE;
rmtree $DAT_OUT_BASE;
mkpath $DAT_OUT_BASE;

# get all large service area for looping
my $master_api = 'http://webservice.recruit.co.jp/'
    . 'hotpepper/large_service_area/v1/?key='
    . $KEY . '&format=json'; 
my $mjs = LWP::Simple::get( $master_api ) or die 'master API get failed';
my $m = JSON::Syck::Load( $mjs );
die if !$m->{results}{large_service_area};

# data store
my $dat = {
    all => [],
};

# fetch all shops via API
my $all_cnt = 0;
ALL_AREAS:
foreach my $lsa (@{ $m->{results}{large_service_area} }){
    warn "processing $lsa->{name}...\n";
    my $start = 1;
    my $i = 1;  # debug
    EACH_REQUEST:
    while (1){
        # retrieve data
        my $r = lwp_get_api( lsa=>$lsa->{code}, start=>$start );
        #use Dumpvalue;
        #Dumpvalue->new->dumpValue( $r );

        EACH_SHOP:
        foreach my $shop ( @{ $r->{shop} } ){
            # store id's
            push @{ $dat->{all} }, $shop->{id};
            # fiddle with image files
            my $img_url = $shop->{photo}{mobile}{s};
            my $stat = LWP::Simple::getstore $img_url, $IMG_TMP;
            if( $stat != 200 ){
                warn "NG\t$img_url";
                next;
            }
            my $img = Imager->new;
            $img->read( file=>$IMG_TMP ) or die $img->errstr();
            my $thumb = make_thumb( $img );
            die if !$thumb;
            my $nn = substr $shop->{id}, -2;
            my $dir = "$IMG_OUT_BASE/$nn";
            mkpath $dir, 0 if !-d $dir;
            my $img_out = "$dir/$shop->{id}.jpg";
            $thumb->write( file=>$img_out ) or die $thumb->errstr;
            $all_cnt++;
            warn "done $shop->{id}.jpg $all_cnt\n";
        }

        last EACH_REQUEST if $i == 5; # for test
        $i++;

        # do we need to fetch more?
        my $page = Data::Page->new();
        $page->total_entries( $r->{results_available} );
        $page->entries_per_page( $COUNT );
        my $curp = ( $r->{results_start} - 1 ) / $COUNT + 1;
        $curp ||= 1;
        $page->current_page( $curp );
        last if !$page->next_page;
        $start = ( $page->next_page - 1 ) * $COUNT + 1;
    }
    last ALL_AREAS; # for test
}
# store all id's dat
store_dat( $dat );
# end
warn "all done. total of " . scalar @{ $dat->{all} } . " shops\n";


# subroutines
sub lwp_get_api {
    my $prm = {
        lsa   => 'SS10',
        start => 1,
        @_,
    };
    my $uri = URI->new( $URL );
    $uri->query_form(
        key    => $KEY,
        format => 'json',
        count  => $COUNT,
        start  => $prm->{start},
        large_service_area => $prm->{lsa},
    );
    my $json = LWP::Simple::get $uri or die 'API get failed';
    my $r = JSON::Syck::Load $json;
    $r = $r->{results} || die $r->{error}[0]{message};
    sleep 1;
    return $r;
}

sub make_thumb {
    my $img = shift || return undef;
    my $w = $img->getwidth;
    my $h = $img->getheight;
    my $cropped = undef;
    if( $w > $h ){
        $cropped = $img->crop( width=>$h );
    }else{
        $cropped = $img->crop( height=>$w );
    }
    my $thumb = $cropped->scale(
        xpixels => $THUMB_WIDTH,
    );
    return $thumb;
}

sub store_dat {
    my $dat = shift || {};
    # all id's
    my $all = "$DAT_OUT_BASE/all.dat";
    open my $fh, '>', $all or die $!;
    print $fh join( "&", @{ $dat->{all} } );
}

END {
    unlink $IMG_TMP if -f $IMG_TMP;
}

#!/usr/bin/perl -w
use CGI qw/-oldstyle_urls/;
use URI;
use XML::TreePP;
use JSON::Syck;
use LWP::UserAgent;
use Location::GeoTool;

# input query
my $cgi = CGI->new;

# change geo code datum
my $lat = $cgi->param( 'lat' );
my $lng = $cgi->param( 'lng' );
#$lat = 34.99484751565505;
#$lng = 135.78494310379028;
if( $lat && $lng ){
   my $gt = Location::GeoTool->new({ changeMyself=>1 }); 
   $gt->set_coord( $lat, $lng, 'wgs84', 'degree' );
   $gt->format_second->datum_tokyo;
   ( $lat, $lng ) = $gt->array;
   $cgi->param( 'y', int $lat * 1000 );  # to milli sec
   $cgi->param( 'x', int $lng * 1000 );
   $cgi->delete( 'lat', 'lng' );
}

# call jalan api
my $base = 'http://jws.jalan.net/APIAdvance/HotelSearch/V1/';
my $url = URI->new( $base . '?' . $cgi->query_string );
my $res = LWP::UserAgent->new( timeout=>5 )->get( $url );

# return object
my $ret = {};

# handle response
my $content = $res->content;
if( $res->code != 200 ){
    # error case
    if( $content =~ m{<Error} ){
        my ($msg) = ( $content =~ m{<Message>(.+?)</Message>} );
        $ret->{Error} = { Message => $msg };
    }else{
        $ret->{Error} = { Message => "something's wrong with api" };
    }
}elsif( $content =~ m{NumberOfResults>0<} ){
    # 0 hit
    $ret->{Error} = { Message => '0 hit' };
}else{
    # OK case
    my $fa = [qw/
        Hotel Plan RoomType PictureURL PictureCaption
        AccessInformation PlanPictureURL PlanPictureCaption
    /];
    my $tpp = XML::TreePP->new( force_array => $fa );
    $ret = $tpp->parse( $content );
}

# print response
my $cbk = $cgi->param( 'callback' ) || 'callback';
print $cgi->header( -type=>'text/javascript', -charset=>'UTF-8' ); 
print "${cbk}(", JSON::Syck::Dump( $ret ), ");";

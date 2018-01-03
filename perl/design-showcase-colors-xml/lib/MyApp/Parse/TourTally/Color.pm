package MyApp::Parse::TourTally::Color;
use base qw( MyApp::Parse::Base );
use strict;
use JSON::PP;

sub _init_fetcher {
    my $self = shift;
    return RWS::Fetch->new(
        api => '/ab-road/tour_tally/v1',
        key => $self->{api}{key},
        params => {
            axis  => 'country',
        },
        debug => 0,
    );
}

sub get_countries {
    my $self = shift;
    my %arg = (
        color    => 'none',
        keywords => [],
        dir      => '.',
        max      => 20,
        @_,
    );
    my $params  = {
        keyword_or => join( q{, }, @{ $arg{keywords} } ),
        count      => $arg{max},
    };
    print "\n# working on $arg{color}\n";
    print "keyword: $params->{keyword_or}\n";
    my $res = $self->{fetcher}->fetch_once( $params );
    my $arr = $res->{results}{tour_tally} || [];
    my $count = 0;
    my @result;
    foreach my $row ( @$arr ){
        my $obj = $self->_prepare_each_row_object( $row );
        push @result, $obj;
        $count++;
    }
    print "total:   $count countries\n";
    return \@result;
}

sub write_json {
    my $self = shift;
    my %arg  = (
        color     => 'none',
        dir       => '.',
        countries => [],
        @_,
    );
    my $file = "$arg{dir}/$arg{color}.json";
    my $json = JSON::PP->new->pretty(1)->encode( $arg{countries} );
    my $fh = IO::File->new( $file, '>' ) or die $!;
    $fh->print( $json );
    my $relpath = File::Spec->abs2rel( $file );
    my $count = scalar @{ $arg{countries} };
    print "$relpath    ... all went well\n";
    return 1;
}

sub _prepare_each_row_object {
    my $self = shift;
    my $row  = shift;
    return {
        code  => $row->{code},
        name  => $row->{name},
        count => $row->{tour_count},
    };
}

1;


package MyApp::Parse::Tour;
use base qw( MyApp::Parse::Base );
use strict;
use JSON::PP;
use File::Path;
use MyApp::DupDropper::Tour;

sub _init_fetcher {
    my $self = shift;
    return RWS::Fetch->new(
        api => '/ab-road/tour/v1',
        key => $self->{api}{key},
        params => {
            count => 100,
        },
        debug => 0,
    );
}

sub create_json {
    my $self = shift;
    my %arg = (
        countries => [],
        keywords  => [],
        dir       => '.',
        max       => 0,
        @_,
    );
    my @ret;
    foreach my $obj ( @{ $arg{countries} } ){
        my $country = $obj->{code};
        my ( $res, $count, $dupcount ) = $self->_fetch_each_country(
            country  => $country,
            keywords => $arg{keywords},
            max      => $arg{max},
        );
        next if !$count;
        $obj->{count} = $count;  # update with dup-eliminated count
        File::Path::mkpath $arg{dir}, 0 if !-d $arg{dir};
        my $file = "$arg{dir}/$country.json";
        my $json = JSON::PP->new->pretty(1)->encode( $res );
        my $fh = IO::File->new( $file, '>' ) or die $!;
        $fh->print( $json );
        my $relpath = File::Spec->abs2rel( $file );
        print "$relpath ... $count tours (-$dupcount dups)";
        print "  $obj->{name}\n";
        push @ret, $obj;
    }
    return \@ret;
}

sub _fetch_each_country {
    my $self = shift;
    my %arg = (
        country  => '',
        keywords => [],
        max => 0,
        @_,
    );
    my $params = {
        country    => $arg{country},
        keyword_or => join( q{,}, @{ $arg{keywords} } ),
    };
    my $dupd = MyApp::DupDropper::Tour->new;
    my @result;
    my $count = 0;
    $self->{fetcher}->fetch_all( sub {
        my $res = shift;
        my $arr = $res->{results}{tour} || [];
        foreach my $row ( @$arr ){
            next if $dupd->is_duplicate( $row );
            my $obj = $self->_prepare_each_row_object( $row );
            next if !$obj;
            push @result, $obj;
            $count++;
            return undef if $count == $arg{max};
        }
        return 1;
    }, $params );
    return \@result, $count, $dupd->{dup_count};
}

sub _prepare_each_row_object {
    my $self = shift;
    my $row  = shift;
    return {
        title => $row->{title},
        url   => $row->{urls}{pc},
    };
}

1;


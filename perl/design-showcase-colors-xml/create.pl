#!/usr/bin/perl -w
use strict;
use FindBin;
use File::Path;
use IO::File;
use Getopt::Long;
use lib "$FindBin::RealBin/lib";
use JSON::PP;
use MyApp::Parse::TourTally::Color;
use MyApp::Parse::Tour;

my $max_countries_per_color = 20;
my $max_tours_per_country   = 200;
my $basedir = "$FindBin::RealBin/result";
my $key     = '3bf6db9fc5cce8d2';
GetOptions(
    "countries=i" => \$max_countries_per_color,
    "tours=i"     => \$max_tours_per_country,
    "dir=s"       => \$basedir,
    "key=s"       => \$key,
);

# prepare stuff
File::Path::rmtree $basedir, 0;
File::Path::mkpath $basedir, 0;

# read color definitions
my $jsf = "$FindBin::RealBin/colors.json";
my $jfh = IO::File->new( $jsf, 'r' ) or die $!;
my $jss = join '', $jfh->getlines;
my $colors = JSON::PP->new->decode( $jss );

# process
foreach my $name ( keys %$colors ){
    my $def = $colors->{ $name };
    # color to countries
    my $tally = MyApp::Parse::TourTally::Color->new( $key );
    my $countries = $tally->get_countries(
        color    => $name,
        keywords => $def->{keywords},
        dir      => $basedir,
        max      => $max_countries_per_color,
    );
    # color x country tour list
    # also update dup-eliminated tour count per country
    $countries = MyApp::Parse::Tour->new( $key )->create_json(
        countries => $countries,
        keywords  => $def->{keywords},
        dir       => "$basedir/$name",
        max       => $max_tours_per_country,
    );
    # write countries tour list to json
    $tally->write_json(
        color     => $name,
        dir       => $basedir,
        countries => $countries,
    );
}

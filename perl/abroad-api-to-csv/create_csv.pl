#!/usr/bin/perl -w
use strict;
use FindBin;
use lib "$FindBin::RealBin/lib";
use RWS::Parse::ABROAD::Area;
use RWS::Parse::ABROAD::Country;
use RWS::Parse::ABROAD::City;
use RWS::Parse::ABROAD::Spot;
use RWS::Parse::ABROAD::Osusume;

my $key = '7b18731dfad050ca';
my $dir = "$FindBin::RealBin/result";
unlink <$dir/*.csv>;

RWS::Parse::ABROAD::Area   ->new( $key )->create_csv( $dir );
RWS::Parse::ABROAD::Country->new( $key )->create_csv( $dir );
RWS::Parse::ABROAD::City   ->new( $key )->create_csv( $dir );
RWS::Parse::ABROAD::Spot   ->new( $key )->create_csv( $dir );
RWS::Parse::ABROAD::Osusume->new( $key )->create_csv( $dir );

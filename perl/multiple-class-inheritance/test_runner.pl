#!/usr/bin/perl -w
use strict;
use FindBin;
my $base = $FindBin::RealBin;
system "prove", "-I", "$base/lib", "$base/t", @ARGV;

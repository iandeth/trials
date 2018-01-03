#!/usr/bin/perl
use lib "../cpanLib";
use lib "../mints/lib";
use lib "../myLib";
use Test::Harness qw(&runtests $verbose);
$verbose=0;
my $a = runtests <@ARGV>;


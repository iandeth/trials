#!/usr/bin/perl -w
#
# Copyright (c) 2009, Toshimasa Ishibashi <bashi@cpan.org>
#
use strict;
use FindBin;
use lib $FindBin::RealBin . '/../lib';
use MyApp::Controller::Fiddle;
use Getopt::Long;

my $trace = 0;
GetOptions( 
    "trace" => \$trace,
);

my $base_dir = $FindBin::RealBin;
my $name = 'fiddle';
my $app = MyApp::Controller::Fiddle->new(
    log => {
        base_dir   => $base_dir . "/../log/$name",
        stderr_too => 2, # disable log file output
        timestamp  => 0,
        trim_ws    => 0,
    },
);

## available methods
my $methods = [qw/
    x01_artist_all
    x02_artist_search
    x03_cd_search_prefetch_artist
    x04_cd_search_with_pager
    x05_insert_new_cd
    x06_component_test_add_columns
    x07_use_base_test
    x99_deployment_statement
/];
my $method_id = shift @ARGV || 1;
my $arr_i = $method_id - 1;
my $method = $methods->[$arr_i] || '';
## method execution
if( !$app->can($method) ){
    $app->error->set_error( "invalid method id: $method_id" );
}else{
    $app->log->set_log( "BEGIN", $method );
    $app->$method( base_dir=>$base_dir, trace=>$trace );
}
## display feedback
if( $app->error->is_error ){
    $app->log->set_log( "ERROR", "exit with error" );
    exit(1);
}
$app->log->set_log( "DONE", "all went well" );

#!/usr/bin/perl -w
#
# Copyright (c) 2009, Toshimasa Ishibashi <bashi@cpan.org>
#
use strict;
use FindBin;
use lib $FindBin::RealBin . '/../lib';
use MyApp::Controller::CreateTables;
use Getopt::Long;

my $intent_error = 0;   # cause database connect error intentionally, for mock use
GetOptions(
    "error" => \$intent_error,
);

my $base_dir = $FindBin::RealBin;
my $name = 'create_tables';
my $app = MyApp::Controller::CreateTables->new(
    log => {
        base_dir   => $base_dir . "/../log/$name",
        stderr_too => 2, # disable log file output
        timestamp  => 0,
    },
);

$app->log->set_log( "BEGIN" );
my $file = $base_dir . "/../database/create_table.sql";
my $load_data_dir = $base_dir . "/../database/initial_data";
$app->process(
    from_file => $file,
    load_data_dir => $load_data_dir,
    intent_error => $intent_error,
);

if( $app->error->is_error ){
    $app->log->set_log( "ERROR", "exit with error" );
    exit(1);
}
$app->log->set_log( "DONE", "all went well" );

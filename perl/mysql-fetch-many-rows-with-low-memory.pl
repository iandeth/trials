#!/usr/bin/perl -w
use strict;
use DBI;
use Dumpvalue;
use Time::HiRes qw/usleep/;

local $| = 1;
my $database = "apviaapps_development";
my $hostname = "localhost";
my $port     = "3306";
my $user     = "apviaapps_user";
my $passwd   = "";
my $dsn      = "DBI:mysql:database=$database;host=$hostname;port=$port";
my $option   = {
    RaiseError => 1,
};
my $dbh = DBI->connect( $dsn, $user, $passwd );

# 対象レコードの ID だけを取得
my $sth = $dbh->prepare( "SELECT id FROM action_logs where app_id = 'bunshin' and event_id = 'q_answered'" );
$sth->execute;

my $sth2 = $dbh->prepare( "SELECT * FROM action_logs where id = ?" );
while ( my $res = $sth->fetchrow_arrayref ){
    my $id = $res->[0];
    # 各レコードの詳細情報を毎回取得 (メモリ節約)
    $sth2->execute( $id );
    my $res2 = $sth2->fetchrow_arrayref;
    print $res2->[0], "\n";
    usleep 200_000;
}
print "\n";

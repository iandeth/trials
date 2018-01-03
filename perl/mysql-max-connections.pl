#!/usr/bin/perl -w
use strict;
use DBI;

my $m_dbh = db_connect();
show_processlist( $m_dbh );

print "start multi connect:\n\n";
for my $i ( 1 .. 10 ){
    my $dbh = db_connect();
    my $res = $dbh->selectall_arrayref(qq{ SHOW TABLES });
    printf "\t%02d. %s\n", $i, \$dbh;
}
print "\n";

show_processlist( $m_dbh );

# subs
sub db_connect {
    my $self = shift;
    my $arg = {
        database => "mysql",
        hostname => "localhost",
        port     => "3306",
        user     => "root",
        passwd   => "",
        @_,
    };
    my $dsn = join ";", (
        "DBI:mysql:database=$arg->{database}",
        "host=$arg->{hostname}",
        "port=$arg->{port}",
    );
    my $option = {
        RaiseError => 1,
    };
    my $dbh = DBI->connect( $dsn, $arg->{user}, $arg->{passwd}, $option );
    return $dbh;
}

sub show_processlist {
    my $dbh  = shift || return undef;
    my $res = $dbh->selectall_arrayref(qq{ SHOW PROCESSLIST });
    print "proc count: ", scalar( @$res ), "\n";
    print "proc list:\n\n";
    my $i = 1;
    foreach my $r ( @$res ){
        map { $_ = 'null' if !defined $_ or $_ eq '' } @$r;
        print "\t$i. ", join( " - ", @$r ), "\n";
        $i++;
    }
    print "\n";
    return;
}

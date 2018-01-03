#!/usr/bin/perl -w
use strict;
use DBI;
use Dumpvalue;

my $database = "test";
my $hostname = "localhost";
my $port     = "3306";
my $user     = "root";
my $passwd   = "";
my $dsn      = "DBI:mysql:database=$database;host=$hostname;port=$port";
my $option   = {
    RaiseError => 1,
};
my $dbh = DBI->connect( $dsn, $user, $passwd );

# create tables
my @defs = (
    { using=>'DELIMITED', name=>'test_d' },
    { using=>'NGRAM',     name=>'test_n' },
    { using=>'MECAB',     name=>'test_m' },
);
foreach ( @defs ){
    $dbh->do(qq{ DROP TABLE IF EXISTS $_->{name} });
    $dbh->do(qq{
        CREATE TABLE $_->{name} (
            id INTEGER AUTO_INCREMENT,
            text TEXT NOT NULL,
            PRIMARY KEY (id),
            FULLTEXT INDEX USING $_->{using} (text)
        )
        ENGINE=MyISAM CHARACTER SET utf8 COLLATE utf8_unicode_ci;
    });
}
my $tbls = $dbh->selectcol_arrayref(qq{ SHOW TABLES });
Dumpvalue->new->dumpValue( $tbls );

# insert rows
my @rows = (
    [ undef, '銀座 居酒屋つぼ八' ],
    [ undef, '渋谷 居酒屋つぼ八' ],
    [ undef, '銀座 居酒屋 つぼ八' ],
    [ undef, '渋谷 居酒屋 つぼ八' ],
);
foreach ( @defs ){
    my $sth = $dbh->prepare(qq{ INSERT INTO $_->{name} VALUES( ?, ? ) });
    foreach my $r ( @rows ){
        $sth->execute( @$r );
    }
}


# tests
# mysql> select * from test_m where match( text ) against( '+銀座居酒屋*' IN BOOLEAN MODE );
# mysql> select * from test_m where match( text ) against( '+居酒屋つぼ*' IN BOOLEAN MODE );
# これですべてヒットするのは mecab 方式のみ

# mysql> select * from test_m where match( text ) against( '+ツボ*' IN BOOLEAN MODE );
# これはどれもヒットせず

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
    { using=>'DELIMITED', name=>'test_sd' },
    { using=>'NGRAM',     name=>'test_sn' },
    { using=>'MECAB',     name=>'test_sm' },
);
foreach ( @defs ){
    $dbh->do(qq{ DROP TABLE IF EXISTS $_->{name} });
    $dbh->do(qq{
        CREATE TABLE $_->{name} (
            id INTEGER AUTO_INCREMENT,
            text1 TEXT NOT NULL,
            text2 TEXT NOT NULL,
            PRIMARY KEY (id),
            FULLTEXT INDEX USING $_->{using}, SECTIONALIZE (text1, text2)
        )
        ENGINE=MyISAM CHARACTER SET utf8 COLLATE utf8_unicode_ci;
    });
}
my $tbls = $dbh->selectcol_arrayref(qq{ SHOW TABLES });
Dumpvalue->new->dumpValue( $tbls );

# insert rows
my @rows = (
    [ undef, 'ダイビング三昧',       'パラオ'     ],
    [ undef, 'ダイビング三昧',       'パラオ旅はパラオ'     ],
    [ undef, 'ダイビング三昧',       'モルディブ' ],
    [ undef, 'ダイビング三昧',       'モルディブ旅はモルディブ' ],
    [ undef, 'パラオでのんびり',     'ダイビング' ],
    [ undef, 'モルディブでのんびり', 'ダイビング' ],
);
foreach ( @defs ){
    my $sth = $dbh->prepare(qq{ INSERT INTO $_->{name} VALUES( ?, ?, ? ) });
    foreach my $r ( @rows ){
        $sth->execute( @$r );
    }
}


# tests
# mysql> select * from test_sm where match( text1, text2 ) against( 'パラオ' );
# 普通に全カラム検索する場合 

# mysql> select * from test_sm where match( text1, text2 ) against( '*W1:1,2:4 パラオ' IN BOOLEAN MODE );
# これで重み付け text2 を4倍評価

# mysql> select *, ( match( text1, text2 ) against( '*W1:1,2:4 パラオ' IN # BOOLEAN MODE ) ) rank from test_sm where match( text1, text2 ) against( '*W1:1,2:4 パラオ' IN BOOLEAN MODE );
# これで重みランク表示。どうやら重みで sort はされない模様

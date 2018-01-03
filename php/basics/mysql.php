<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## doc
# http://www.php.net/manual/en/ref.mysql.php

## table to use:
# CREATE TABLE foo (
#     id int AUTO_INCREMENT,
#     text text,
#     PRIMARY KEY (id)
# ); 

$dbname = 'test';
$dbh = null;


echo "## connect\n";
$m = function () use( &$dbh, $dbname ){
    $dbh = mysql_connect('localhost', 'root', 'root')
        or die( 'mysql_connect failed: ' . mysql_error() );
    print_r( $dbh );
    mysql_select_db( $dbname )
        or die( 'mysql_select_db failed' );

    ## or pconnect, for persistent connection
    # $dbh = mysql_pconnect('localhost', 'root', 'root');
};
$m();


echo "\n## truncate + insert\n";
$m = function () use( $dbh ){
    ## truncate
    _query( "TRUNCATE TABLE foo" );

    ## insert 1 row
    $sql = sprintf("INSERT INTO foo VALUES ( null, '%s' )",
        mysql_real_escape_string( 'aaa' )
    );
    _query( $sql );
    echo "insert id: ", mysql_insert_id(), "\n";

    ## insert multiple rows
    $sql = sprintf("INSERT INTO foo VALUES ( null, '%s' ), ( null, '%s' )",
        mysql_real_escape_string( 'bbb' ),
        mysql_real_escape_string( 'ccc 日本語' )
    );
    _query( $sql );
    echo "inserted row count: ", mysql_affected_rows(), "\n";
};
$m();


echo "\n## select + single row fetch\n";
$m = function () use( $dbh ){
    $sql = sprintf("SELECT * FROM foo WHERE text = '%s'",
        mysql_real_escape_string( 'bbb' )
    );
    $res = _query( $sql );

    $row = mysql_fetch_row( $res );    # as array
    #$row = mysql_fetch_assoc( $res );  # as hash
    if( !$row ){
        echo "row not found\n";
        return;
    }
    print_r( $row );
    mysql_free_result( $res );
};
$m();


echo "\n## select + loop fetch\n";
$m = function () use( $dbh ){
    $sql = sprintf("SELECT * FROM foo ORDER BY id");
    $res = _query( $sql );

    ## loop fetch
    while( $row = mysql_fetch_assoc($res) ){
        echo "row: $row[id], $row[text]\n";
    }
    mysql_free_result( $res );
};
$m();


echo "\n## stat\n";
$m = function () use( $dbh ){
    echo "mysql_stat: " . mysql_stat( $dbh ) . "\n";
    echo "mysql_get_host_info: " . mysql_get_host_info() . "\n";
};
$m();


## close
mysql_close( $dbh );


## util function
function _query ( $sql ){
    $res = mysql_query( $sql )
        or die( 'mysql_query failed: ' . mysql_error() . " [SQL] $sql" );
    return $res;
}

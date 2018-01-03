<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## doc
# http://www.php.net/manual/en/class.mysqli.php

## table to use:
# CREATE TABLE foo (
#     id int AUTO_INCREMENT,
#     text text,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 

$dbname = 'test';
$dbh = null;

echo "## connect\n";
$m = function () use( &$dbh, $dbname ){
    $dbh = new mysqli( 'localhost', 'root', 'root', $dbname );
    if( $err = $dbh->connect_error )
        die( 'mysqli connect failed: ' . $err );
};
$m();


echo "\n## truncate + insert\n";
$m = function () use( $dbh ){
    ## truncate
    $sql = "TRUNCATE TABLE foo";
    $dbh->query( $sql )
        or die( $dbh->error . " [SQL] $sql" );

    ## insert
    $sql = "INSERT INTO foo VALUES (null, ?), (null, ?), (null, ?)";
    $sth = $dbh->prepare( $sql )
        or die( $dbh->error . " [SQL] $sql" );
    $v = array( 'aaa', 'bbb', 'ccc 日本語' );
    $sth->bind_param( 'sss', $v[0], $v[1], $v[2] );
    $sth->execute()
        or die( $sth->error . " [SQL] $sql" );
    echo "inserted row count: ", $sth->affected_rows, "\n";
    echo "last insert id: ", $sth->insert_id, "\n";
};
$m();


echo "\n## select + single row fetch\n";
$m = function () use( $dbh ){
    $sql = sprintf("SELECT * FROM foo WHERE text = '%s'",
        $dbh->real_escape_string( 'bbb' ) );
    $res = $dbh->query( $sql )
        or die( $dbh->error . " [SQL] $sql" );
    if( !$res->num_rows ){
        echo "row not found\n";
        return;
    }
    $row = $res->fetch_row();     # by array
    # $row = $res->fetch_assoc(); # by hash
    print_r( $row );
    $res->free_result();
};
$m();


echo "\n## select + loop fetch\n";
$m = function () use( $dbh ){
    $sql = sprintf("SELECT * FROM foo ORDER BY id");
    $res = $dbh->query( $sql )
        or die( $dbh->error . " [SQL] $sql" );

    ## loop fetch
    while( $row = $res->fetch_assoc() ){
        echo "row: $row[id], $row[text]\n";
    }
    $res->free_result();
};
$m();


echo "\n## stat\n";
$m = function () use( $dbh ){
    echo "stat: " . $dbh->stat() . "\n";
    echo "host info: " . $dbh->host_info . "\n";
};
$m();


echo "\n## transaction\n";
$m = function () use( $dbh ){
    ## rollback won't work with autocommit = true
    $dbh->autocommit( FALSE );

    ## check auto commit setting
    $row = $dbh->query("SELECT @@autocommit")->fetch_row();
    echo "autocommit is: $row[0]\n";

    ## check current record count
    $sql = "SELECT count(*) FROM foo";
    $row = $dbh->query( $sql )->fetch_row();
    echo "count: $row[0]\n";

    ## insert row and rollback
    $sql = sprintf("INSERT INTO foo VALUES( null, '%s' )",
        $dbh->real_escape_string('ddd') );
    $dbh->query( $sql ) or die( $dbh->error . " [SQL] $sql" );
    $dbh->rollback(); # or
    # $dbh->commit();

    ## now, check record count again
    $sql = "SELECT count(*) FROM foo";
    $row = $dbh->query( $sql )->fetch_row();
    echo "count: $row[0]\n";
};
$m();


## close
$dbh->close();

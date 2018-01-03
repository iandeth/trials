<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## doc
# http://www.php.net/manual/en/book.pdo.php

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
    try {
        $dbh = new PDO( "mysql:host=localhost;dbname=$dbname", 'root', 'root', array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,  # or PDO::FETCH_NUM
        ));

        ## or a persistent connection
        #$dbh = new PDO( "mysql:host=localhost;dbname=$dbname", 'root', 'root', array(
        #    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        #    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        #    PDO::ATTR_PERSISTENT => true
        #));
    }catch ( PDOException $e ){
        die( $e->getMessage() . "\n" );
    }
};
$m();


echo "\n## truncate + insert\n";
$m = function () use( $dbh ){
    try {
        ## truncate
        $sql = "TRUNCATE TABLE foo";
        $rows = $dbh->exec( $sql );

        ## insert
        $sql = "INSERT INTO foo VALUES (null, ?), (null, ?), (null, ?)";
        $sth = $dbh->prepare( $sql );
        $sth->execute(array( 'aaa', 'bbb', 'ccc 日本語' ));
        echo "inserted row count: ", $sth->rowCount(), "\n";
        echo "last insert id: ", $dbh->lastInsertId(), "\n";
    }catch ( PDOException $e ){
        die( $e->getMessage() . "\n" );
    }
};
$m();


echo "\n## select count\n";
$m = function () use( $dbh ){
    try {
        $sql = 'SELECT count(*) FROM foo';
        $col = $dbh->query( $sql )->fetchColumn();
        echo "count: $col\n";
    }catch ( PDOException $e ){
        die( $e->getMessage() . "\n" );
    }
};
$m();


echo "\n## select + single row fetch\n";
$m = function () use( $dbh ){
    try {
        $sql = 'SELECT * FROM foo WHERE text = ?';
        $sth = $dbh->prepare( $sql );
        $sth->execute(array( 'bbb' ));
        if( !$sth->rowCount() ){
            echo "row not found\n";
            return;
        }
        $row = $sth->fetch();
        print_r( $row );
    }catch ( PDOException $e ){
        die( $e->getMessage() . "\n" );
    }
};
$m();


echo "\n## select + loop fetch\n";
$m = function () use( $dbh ){
    try {
        $sql = 'SELECT * FROM foo ORDER BY id';
        $sth = $dbh->query( $sql );

        ## loop fetch
        while( $row = $sth->fetch() ){
            echo "row: $row[id], $row[text]\n";
        }
    }catch ( PDOException $e ){
        die( $e->getMessage() . "\n" );
    }
};
$m();


echo "\n## transaction\n";
$m = function () use( $dbh ){
    try {
        ## check auto commit setting
        echo "autocommit is: ", $dbh->getAttribute( PDO::ATTR_AUTOCOMMIT ), "\n";

        $dbh->beginTransaction();

        ## check current record count
        $sql = "SELECT count(*) FROM foo";
        $col = $dbh->query( $sql )->fetchColumn();
        echo "count: $col\n";

        ## insert row and rollback
        $sql = "INSERT INTO foo VALUES( null, ? )";
        $dbh->prepare( $sql )->execute(array( 'ddd' ));
        $dbh->rollback(); # or
        #$dbh->commit();

        ## now, check record count again
        $sql = "SELECT count(*) FROM foo";
        $col = $dbh->query( $sql )->fetchColumn();
        echo "count: $col\n";
    }catch ( PDOException $e ){
        die( $e->getMessage() . "\n" );
    }
};
$m();


## close
$dbh = null;

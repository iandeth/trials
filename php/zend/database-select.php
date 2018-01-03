<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.db.select.html

## テーブル状態初期化
$dbh = Zend_Db::factory( $conf->database );
Util::setupTableFooAndBar( $dbh );


echo "\n## select count\n";
$m = function () use( $dbh ){
    $sel = $dbh->select()->from( 'foo', 'COUNT(*)' );
    $col = $dbh->fetchOne( $sel );
    echo "count: $col\n";
};
$m();


echo "\n## select + single row fetch\n";
$m = function () use( $dbh ){
    $sel = $dbh->select()
        ->from( 'foo' )
        ->where( 'text = ?', 'bbb' );
    $row = $dbh->fetchRow( $sel );
    if( !$row )
        die( "row not found\n" );
    print_r( $row );
};
$m();


echo "\n## select + loop fetch\n";
$m = function () use( $dbh ){
    $sel = $dbh->select()
        ->from( 'foo' )
        ->where( 'id IN( ? )', array(1, 2) )
        ->order( 'id' );
    $sth = $dbh->query( $sel );

    ## loop fetch
    while( $row = $sth->fetch() ){
        echo "row: $row[id], $row[text]\n";
    }
};
$m();


echo "\n## select join\n";
$m = function () use( $dbh ){
    $sel = $dbh->select()
        ->from(
            array('f'=>'foo'),
            array( 'foo_id'=>'id', 'foo_text'=>'text' )
        )->join(
            array('b'=>'bar'),
            'f.id = b.foo_id',
            array( 'bar_id'=>'id', 'bar_text'=>'text' )
        )->where(
            'f.id IN( ? )', array(1, 2)
        );
    $rows = $dbh->fetchAll( $sel );
    print_r( $rows );
};
$m();


echo "\n## select limit\n";
$m = function () use( $dbh ){
    ## basic
    $sel = $dbh->select()
        ->from( 'foo' )
        ->limit( 2 );
    $rows = $dbh->fetchAll( $sel );
    echo "limit count: " . count($rows) . "\n";

    ## pager like
    $sel = $dbh->select()
        ->from( 'foo' )
        ->limitPage( 1, 3 );
    $rows = $dbh->fetchAll( $sel );
    echo "limit count: " . count($rows) . "\n";
};
$m();

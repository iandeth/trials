<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.db.html

## 注意
# SELECT 文で bind param 使ってるけどこれだと MySQL
# で Query Cache 対象にならない。自分で quote すべし。

## table to use:
# CREATE TABLE foo (
#     id int AUTO_INCREMENT,
#     text text,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 

$dbh = null;

echo "## connect\n";
$m = function () use( $conf, &$dbh ){

    $dbh = Zend_Db::factory( $conf->database );
    $pdo = $dbh->getConnection();  ## lazy load させず今すぐ接続

    ## あるいは Exception 処理したいなら以下。
    ## ただし Zend FW がやってくれるので不要かと
    # try {
    #     $dbh = Zend_Db::factory( $conf->database );
    #     $pdo = $dbh->getConnection();
    # }catch ( Zend_Exception $e ){
    #     die( $e->getMessage()."\n" );
    # }
};
$m();


echo "\n## truncate + insert\n";
$m = function () use( $dbh ){
    ## truncate
    $sql = "TRUNCATE TABLE foo";
    $dbh->query( $sql );  # 第二引数以降で bind param 指定

    ## insert 単行
    $sql = "INSERT INTO foo VALUES (null, ?)";
    $sth = $dbh->query( $sql, array( 'aaa' ) );
    echo "inserted row count: ", $sth->rowCount(), "\n";
    echo "last insert id: ", $dbh->lastInsertId(), "\n";

    ## insert 単行 (ZendDB オリジナル版)
    $data = array( 'text'=>'bbb' );  # bind quote される
    $rows = $dbh->insert( 'foo', $data );
    echo "v2 last insert id: ", $dbh->lastInsertId(), "\n";

    ## insert 複数行
    $sql = "INSERT INTO foo VALUES (null, ?)";
    $sth = $dbh->prepare( $sql );
    $data = array( 'ccc 日本語', 'ddd' );
    foreach( $data as $v ){
        $ok = $sth->execute(array( $v ));
        echo "v3 last insert id: ", $dbh->lastInsertId(), "\n";
    }
};
$m();


echo "\n## update\n";
$m = function () use( $dbh ){
    ## insert 手短(?)版
    ## 自分で where 句を bind しないと駄目なのが面倒
    $where = sprintf( 'id IN( %s, %s )',
        $dbh->quote( 3 ), $dbh->quote( 4 ) );
    $data = array( 'text'=>'updated' );
    $rows = $dbh->update( 'foo', $data, $where );
    echo "updated: $rows\n";
};
$m();


echo "\n## select count\n";
$m = function () use( $dbh ){
    $col = $dbh->fetchOne( 'SELECT count(*) FROM foo' );
    echo "count: $col\n";
};
$m();


echo "\n## select + single row fetch\n";
$m = function () use( $dbh ){
    $row = $dbh->fetchRow( 'SELECT * FROM foo WHERE text = ?', 'bbb' );
    if( !$row )
        die( "row not found\n" );
    print_r( $row );
};
$m();


echo "\n## select + loop fetch\n";
$m = function () use( $dbh ){
    $sql = 'SELECT * FROM foo WHERE id IN( ?, ? ) ORDER BY id';
    $sth = $dbh->query( $sql, array(1, 2) );

    ## loop fetch
    while( $row = $sth->fetch() ){
        echo "row: $row[id], $row[text]\n";
    }
};
$m();


echo "\n## transaction\n";
$m = function () use( $dbh ){

    $dbh->beginTransaction();
    try {
        ## check current record count
        $sql = "SELECT count(*) FROM foo";
        $col = $dbh->fetchOne( $sql );
        echo "count: $col\n";

        ## insert row and rollback
        $sql = "INSERT INTO foo VALUES( null, ? )";
        $dbh->query( $sql, array( 'eee' ) );
        throw new Exception('rollback!');
        # or
        $dbh->commit();
    } catch ( Exception $e ){
        $dbh->rollBack();
        echo $e->getMessage(), "\n";
    }

    ## now, check record count again
    $sql = "SELECT count(*) FROM foo";
    $col = $dbh->fetchOne( $sql );
    echo "count: $col\n";
};
$m();

## 閉じる (基本的には不要)
$dbh->closeConnection();

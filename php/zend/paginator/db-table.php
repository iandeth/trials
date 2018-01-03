<?php
$conf = require dirname(__FILE__).'/../bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.paginator.usage.html

## tables to use:
# CREATE TABLE paginator (
#     id int AUTO_INCREMENT,
#     text text,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 

## データ準備
$dbh = Zend_Db::factory( $conf->database );
Zend_Db_Table_Abstract::setDefaultAdapter( $dbh );
$recs = 200;
if( intval($dbh->fetchOne( 'SELECT count(*) FROM paginator' )) !== $recs ){
    $dbh->query( 'TRUNCATE TABLE paginator' );
    $sth = $dbh->prepare( 'INSERT INTO paginator VALUES (null, ?)' );
    for($i=1; $i<=$recs; $i++)
        $sth->execute(array( "データ$i" ));
    echo "$recs records inserted.\n";
}

## クエリ作成
$schema = new Zend_Db_Table('paginator');
$select = $schema->select()->order('id');

## ビュー準備
$view = new Zend_View(array('scriptPath' => APP_ROOT.'/paginator/view'));
$pager = Zend_Paginator::factory($select);
$pager->setPageRange(5);
$pager->setItemCountPerPage(10);
if( isset($_GET['page']) )
    $pager->setCurrentPageNumber( intval($_GET['page']) );
$view->pager = $pager;
echo $view->render('result-db-table.php');

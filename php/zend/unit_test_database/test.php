<?php
$conf = require dirname(__FILE__) . '/../bootstrap.php';

##
## Zend_Test_PHPUnit_Db
## http://framework.zend.com/manual/en/zend.test.phpunit.db.html
##

## tables to use:
# CREATE TABLE guestbook (
#     id int AUTO_INCREMENT,
#     user varchar(50),
#     content text,
#     created datetime,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 
#
# CREATE TABLE foo (
#     id int AUTO_INCREMENT,
#     text text,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 


## 2011.07.25 Zend コードのバグがある
## 発生 Zend FW version: 1.11.9
## Zend/Test/PHPUnit/Db/Connection.php の末尾に以下を追加すべし
#
#+ public function getRowCount($tableName, $whereClause = NULL){
#+     $query = "SELECT COUNT(*) FROM ".$this->quoteSchemaObject($tableName);
#+     if (isset($whereClause))
#+         $query .= " WHERE {$whereClause}";
#+     return (int) $this->_connection->query($query)->fetchColumn();
#+ }


class MyTest extends Zend_Test_PHPUnit_DatabaseTestCase {

    private $dir = '.';
    private $dbc = null;
    private $dbh = null;
    private $schema = 'test';

    public function setUp (){
        $this->dir = realpath(dirname(__FILE__));
        parent::setUp();
    }

    public function getConnection (){
        if( $this->dbc !== null )
            return $this->dbc;
        global $conf;
        $this->dbh = Zend_Db::factory( $conf->database );
        $this->dbc = $this->createZendDbConnection( $this->dbh, $this->schema );
        Zend_Db_Table_Abstract::setDefaultAdapter( $this->dbh );
        return $this->dbc;
    }

    public function getDataSet (){
        ## テストブロック毎の初期レコードセット
        return new PHPUnit_Extensions_Database_DataSet_YamlDataSet(
            $this->dir.'/fixture.yml' );
        # with XML
        # return $this->createFlatXMLDataSet( $this->dir.'/guestbook.xml' );
    }

    public function testAddEntry (){
        $dbc = $this->dbc;
        ## 現在のレコード数
        $this->assertEquals( 3, $dbc->getRowCount('guestbook') );
        $this->assertEquals( 2, $dbc->getRowCount('foo') );
        ## １レコード足してみる
        $sql = 'INSERT INTO guestbook VALUES( null, ?, ?, null )';
        $this->dbh->query( $sql, array('suzy', 'hello!') );
        ## レコード数増えてる
        $this->assertEquals( 4, $dbc->getRowCount('guestbook') );
    }

    public function testSingleTable (){
        $dbc = $this->dbc;
        $dbh = $this->dbh;
        ## レコード数 3 にリセットされてる
        $this->assertEquals( 3, $dbc->getRowCount('guestbook') );
        ## チェックしたい DB レコードセットを指定
        $sql = 'SELECT id, user, content FROM guestbook ORDER BY id DESC';
        $tbl = $dbc->createQueryTable( 'guestbook', $sql );
        ## 期待のレコードセット状態を YAML で定義しておく
        $ds = new PHPUnit_Extensions_Database_DataSet_YamlDataSet(
            $this->dir.'/single-table.yml' );
        $expect = $ds->getTable( 'guestbook' );
        ## 比較
        $this->assertTablesEqual( $expect, $tbl );
    }

    public function testMultipleDataSet (){
        $dbc = $this->dbc;
        ## チェックしたい DB レコードセット群を指定
        $ds = new Zend_Test_PHPUnit_Db_DataSet_QueryDataSet( $dbc );
        $ds->addTable( 'guestbook', 'SELECT id, user, content FROM guestbook ORDER BY id' );
        $ds->addTable( 'foo', 'SELECT * FROM foo ORDER BY id DESC' );
        ## 期待のレコードセット状態を YAML で定義しておく
        $dsex = new PHPUnit_Extensions_Database_DataSet_YamlDataSet(
            $this->dir.'/multiple-dataset.yml' );
        $this->assertDataSetsEqual( $dsex, $ds );
    }
}

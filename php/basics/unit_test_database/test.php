<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

##
## PHPUnit
## http://www.phpunit.de/manual/3.5/en/database.html#configuration-of-a-phpunit-database-testcase
##
require_once 'PHPUnit/Autoload.php';

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

class MyTest extends PHPUnit_Extensions_Database_TestCase {

    private $dir = '.';
    private $dbc = null;
    private $pdo = null;

    public function setUp (){
        $this->dir = realpath(dirname(__FILE__));
        parent::setUp();
    }

    public function getConnection (){
        if( $this->dbc !== null )
            return $this->dbc;
        $pdo = new PDO( "mysql:host=localhost;dbname=test", 'root', 'root', array(
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ));
        $this->pdo = $pdo;
        $this->dbc = $this->createDefaultDBConnection($pdo);
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
        try {
            $sql = 'INSERT INTO guestbook VALUES( null, ?, ?, null )';
            $this->pdo->prepare( $sql )->execute(array( "suzy", "hello!" ));
        }catch ( PDOException $e ){
            die( $e->getMessage() . "\n" );
        }
        ## レコード数増えてる
        $this->assertEquals( 4, $dbc->getRowCount('guestbook') );
    }

    public function testSingleTable (){
        $dbc = $this->dbc;
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
        $ds = new PHPUnit_Extensions_Database_DataSet_QueryDataSet($dbc);
        $ds->addTable( 'guestbook', 'SELECT id, user, content FROM guestbook ORDER BY id' );
        $ds->addTable( 'foo', 'SELECT * FROM foo ORDER BY id DESC' );
        ## 期待のレコードセット状態を YAML で定義しておく
        $dsex = new PHPUnit_Extensions_Database_DataSet_YamlDataSet(
            $this->dir.'/multiple-dataset.yml' );
        $this->assertDataSetsEqual( $dsex, $ds );
    }
}

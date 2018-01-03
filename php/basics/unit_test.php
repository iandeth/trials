<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );
require_once 'PHPUnit/Autoload.php';

##
## using PHPUnit v5.3
## http://www.phpunit.de/manual/3.5/en/writing-tests-for-phpunit.html
##
class SameTest extends PHPUnit_Framework_TestCase {

    public function testFoo(){
        $this->assertEquals( '2204', '2204' );
        $this->assertSame( '2204', '2204' );
    }

    public function testLater(){
        $this->markTestIncomplete( 'xxx クラス実装したらテスト書く' );
        $this->assertEquals( 'wrong', 'expect' );  // this'll be skipped
    }

    public function testSkipped(){
        if( 1 )
            $this->markTestSkipped( 'EC2 の場合はテスト不可能' );
        $this->assertEquals( 'bad again', 'expect' );
    }
}

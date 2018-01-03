<?php
App::uses('Tag2', 'Model');

class Tag2TestCase extends CakeTestCase {

	public $fixtures = array('app.tag2', 'app.post2', 'app.post2s_tag2');

	public function setUp() {
		parent::setUp();
		$this->Tag2 = ClassRegistry::init('Tag2');
	}

	public function testInitialData() {
		$this->Tag2->recursive = 0;
		$res = $this->Tag2->find('all');
		$expect = array(
			array('Tag2'=>array('id'=>1, 'name'=>'Mac', 'post2_count'=>2, 'post2s_tag2_count'=>2)),
			array('Tag2'=>array('id'=>2, 'name'=>'iPhone', 'post2_count'=>1, 'post2s_tag2_count'=>1)),
			array('Tag2'=>array('id'=>3, 'name'=>'Windows', 'post2_count'=>0, 'post2s_tag2_count'=>0)),
		);
		debug($res);
		$this->assertEquals($expect, $res);
	}

	public function tearDown() {
		unset($this->Tag);
		parent::tearDown();
	}

}

<?php
App::uses('Tag', 'Model');

class TagTestCase extends CakeTestCase {

	public $fixtures = array('app.tag', 'app.post', 'app.category', 'app.posts_tag', 'app.user');

	public function setUp() {
		parent::setUp();
		$this->Tag = ClassRegistry::init('Tag');
	}

	## ORDER BY 付きで find()
	## http://book.cakephp.org/2.0/en/models/retrieving-your-data.html#find
	public function testInitialData() {
		$this->Tag->recursive = 0;
		$res = $this->Tag->find('all', array('order'=>'id asc'));
		$expect = array(
			array('Tag'=>array('id'=>1, 'name'=>'Mac', 'post_count'=>'2')),
			array('Tag'=>array('id'=>2, 'name'=>'iPhone', 'post_count'=>'1')),
			array('Tag'=>array('id'=>3, 'name'=>'Windows', 'post_count'=>'0')),
		);
		debug($res);
		$this->assertEquals($expect, $res);
	}

	## find('list') を試す
	public function testFindList() {
		$list = $this->Tag->find('list');
		debug($list);
		$this->assertEquals(count($list), 3);
	}

	public function tearDown() {
		unset($this->Tag);
		parent::tearDown();
	}

}

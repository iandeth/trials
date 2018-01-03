<?php
App::uses('Category', 'Model');
App::uses('Post', 'Model');
App::uses('User', 'Model');

class CategoryTestCase extends CakeTestCase {

	public $fixtures = array('app.category', 'app.post', 'app.user');

	public function setUp() {
		parent::setUp();
		$this->Category = ClassRegistry::init('Category');
		$this->Post = ClassRegistry::init('Post');
	}

	## Fixture が読み込まれているか確認
	## http://book.cakephp.org/2.0/en/models/retrieving-your-data.html#find
	public function testInitialData() {
		$this->Category->recursive = 0;  // join 不要
		$res = $this->Category->find('all');
		debug($res);
		$expect = array(
			array('Category'=>array('id'=>1, 'name'=>'PHP', 'post_count'=>2, 'sort_order'=>1)),
			array('Category'=>array('id'=>2, 'name'=>'Perl', 'post_count'=>1, 'sort_order'=>2)),
		);
		$this->assertEquals($expect, $res);
	}

	public function tearDown() {
		unset($this->Category);
		unset($this->Post);
		parent::tearDown();
	}

}

<?php
App::uses('Post2sTag2', 'Model');

class Post2sTag2TestCase extends CakeTestCase {

	public $fixtures = array('app.post2s_tag2', 'app.post2', 'app.tag2');

	public function setUp() {
		parent::setUp();
		$this->Post2sTag2 = ClassRegistry::init('Post2sTag2');
	}

	public function testInitialData() {
		## recursive 1 で綺麗な JOIN SELECT で取得できる
		$this->Post2sTag2->recursive = 1;
		$res = $this->Post2sTag2->find('all');
		debug($res);
	}

	public function tearDown() {
		unset($this->Post2sTag2);
		parent::tearDown();
	}

}

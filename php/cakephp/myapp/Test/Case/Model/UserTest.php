<?php
App::uses('User', 'Model');
App::uses('Post', 'Model');

class UserTestCase extends CakeTestCase {
	public $fixtures = array('app.user', 'app.post', 'app.category', 'app.tag', 'app.posts_tag');

	public function setUp() {
		parent::setUp();
		$this->User = ClassRegistry::init('User');
		$this->Post = ClassRegistry::init('Post');
	}

	public function testInitialData() {
		$this->User->recursive = 1;  # これがデフォルト
		$res = $this->User->find('all');
		debug($res);
		$this->assertEquals('ユーザー１', $res[0]['User']['username']);
		$this->assertEquals('ユーザー２', $res[1]['User']['username']);
		$this->assertEquals(2, $this->User->find('count'));
	}

	public function testDependentDelete() {
		## まず現状テーブル状態の確認
		$this->assertNotEmpty($this->User->findById(1));
		$this->assertEquals($this->Post->find(
			'count', array('conditions'=>array('user_id'=>1))
		), 2);
		$this->assertTrue($this->User->delete(1, true));  # true = Post も消す

		## User も Post も消えてる
		$this->assertEmpty($this->User->findById(1));
		$this->assertEquals($this->Post->find(
			'count', array('conditions'=>array('user_id'=>1))
		), 0);
	}

	public function testAutoUpdateModified() {
		## まず現状テーブル状態の確認
		$before = new DateTime($this->User->field('modified', array('id'=>1)));
		$this->assertEquals($before->format('Y-m-d H:i:s'), '2011-12-26 00:08:54');
		## 情報を update
		$saved = $this->User->save(array('id'=>1, 'username'=>'foo'));
		$after = new DateTime($saved['User']['modified']);
		## 比較 -> ちゃんと更新されてる
		$this->assertTrue($after > $before);
	}

	public function tearDown() {
		unset($this->User);
		unset($this->Post);
		parent::tearDown();
	}

}

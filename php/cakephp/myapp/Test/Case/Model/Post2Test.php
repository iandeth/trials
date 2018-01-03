<?php
App::uses('Post2', 'Model');
App::uses('Tag2', 'Model');
App::uses('Post2sTag2', 'Model');

class Post2TestCase extends CakeTestCase {

	public $fixtures = array('app.post2', 'app.tag2', 'app.post2s_tag2');

	public function setUp() {
		parent::setUp();
		$this->Post2 = ClassRegistry::init('Post2');
		$this->Tag2 = ClassRegistry::init('Tag2');
		$this->Post2sTag2 = ClassRegistry::init('Post2sTag2');
	}

	public function testInitialData() {
		$this->Post2->recursive = 1;  # post2s_tag2s レコードも拾う。ただしタグ名は無し
		#$this->Post2->recursive = 2;  # tag2s レコードも追加で拾うのでタグ名もあり。ただし SQL 回数多い
		$res = $this->Post2->find('all');
		debug($res);
		$this->assertEquals($res[0]['Post2']['title'], 'エントリ１');
		$this->assertEquals($res[1]['Post2']['title'], 'エントリ２');
		$this->assertEquals($res[2]['Post2']['title'], 'エントリ３');
		$this->assertEquals($this->Post2->find('count'), 3);
	}

	## belongsTo 関係テーブル側の [name]_count カラム自動
	## increment 機能を試す。
	## HABTM join associated table records の追加方法。
	public function testCounterCache() {
		## まず現状テーブル状態の確認
		$this->assertEquals($this->Post2->find('count'), 3);
		$this->assertEquals($this->Tag2->field('post2_count', array('id'=>1)), 2);
		$this->assertEquals($this->Tag2->field('post2_count', array('id'=>2)), 1);
		$this->assertEquals($this->Post2sTag2->find('count'), 3);

		## Post2 １件と post2s_tag2s を２件追加
		## この方法だと post2s_tag2s に複数レコード挿入可能
		$this->Post2->create();
		$ok = $this->Post2->saveAll(array(   # or saveAssociated() でも同じ
			'Post2' => array(
				'title' => 'エントリ４',
				'body' => 'けけここ',
			),
			'Post2sTag2' => array(
				array('tag2_id'=>1),
				array('tag2_id'=>2),
			),
		));
		$post2_id = $this->Post2sTag2->Post2->id;
		$this->assertEquals($this->Post2->find('count'), 4, 'post2s 増えてる');
		$this->assertEquals($this->Post2sTag2->find('count'), 5, 'post2s_tags 増えてる');

		## HABTM だと post2_count, tag2_count それぞれの counterCache は機能しない。
		$this->assertEquals($this->Post2->field('tag2_count', array('id'=>$post2_id)), 0);
		$this->assertEquals($this->Tag2->field('post2_count', array('id'=>1)), 2);

		## post2, tag2 テーブル側のカラム名を post2s_tag2_count にすると counterCache 機能する。
		## ただしカラム名が [post2|tag2]_count では無くなるので若干判りづらい
		$this->assertEquals($this->Post2->field('post2s_tag2_count', array('id'=>$post2_id)), 2);
		$this->assertEquals($this->Tag2->field('post2s_tag2_count', array('id'=>1)), 3);
		$this->assertEquals($this->Tag2->field('post2s_tag2_count', array('id'=>2)), 2);
	}

	public function testHabtmDependentDelete() {
		## まず現状テーブル状態の確認
		$this->assertNotEmpty($this->Post2->findById(1));
		$this->assertEquals($this->Post2sTag2->find('count', array('conditions'=>array('post2_id'=>1))), 2);
		$this->assertEquals($this->Tag2->field('post2s_tag2_count', array('id'=>1)), 2);
		$this->assertEquals($this->Tag2->field('post2s_tag2_count', array('id'=>2)), 1);

		## Post を削除して件数を確認
		$this->assertTrue($this->Post2->delete(1));
		$this->assertEmpty($this->Post2->findById(1));

		## dependent = true 設定する事で dependentDelete は有効
		$this->assertEquals($this->Post2sTag2->find('count', array('conditions'=>array('post2_id'=>1))), 0);
		## post_id = 2 に紐尽くレコードのみ残ってる
		$this->assertEquals($this->Post2sTag2->find('count'), 1);
		## Tag 側の count 値も decrement してる
		$this->assertEquals($this->Tag2->field('post2s_tag2_count', array('id'=>1)), 1);
		$this->assertEquals($this->Tag2->field('post2s_tag2_count', array('id'=>2)), 0);
	}

	public function tearDown() {
		unset($this->Post2);
		unset($this->Tag2);
		unset($this->Post2sTag2);
		parent::tearDown();
	}

}

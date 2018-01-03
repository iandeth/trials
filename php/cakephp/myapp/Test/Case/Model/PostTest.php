<?php
App::uses('Post', 'Model');
App::uses('Category', 'Model');
App::uses('Tag', 'Model');
App::uses('User', 'Model');

class PostTestCase extends CakeTestCase {

	public $fixtures = array('app.post', 'app.user', 'app.category', 'app.tag', 'app.posts_tag');

	public function setUp() {
		parent::setUp();
		$this->Post = ClassRegistry::init('Post');
		$this->Category = ClassRegistry::init('Category');
		$this->Tag = ClassRegistry::init('Tag');
		$this->User = ClassRegistry::init('User');
	}

	public function testInitialData() {
		#$this->Post->recursive = -1;  # これだと posts のみ
		#$this->Post->recursive = 0;   # これだと users, categories を JOIN
		$this->Post->recursive = 1;   # これだと users, categories, tags を JOIN
		$res = $this->Post->find('all');
		debug($res);
		$this->assertEquals($res[0]['Post']['title'], 'エントリ１');
		$this->assertEquals($res[1]['Post']['title'], 'エントリ２');
		$this->assertEquals($res[2]['Post']['title'], 'エントリ３');
		$this->assertEquals($this->Post->find('count'), 3);
	}

	## belongsTo 関係テーブル側の [name]_count カラム自動
	## increment 機能を試す。
	## HABTM associated table records の追加方法。
	public function testCounterCache() {
		## まず現状テーブル状態の確認
		$this->assertEquals($this->Post->find('count'), 3);
		$this->assertEquals($this->Tag->field('post_count', array('id'=>1)), 2);
		$this->assertEquals($this->Category->field('post_count', array('id'=>2)), 1);
		$this->assertEquals($this->User->field('post_count', array('id'=>1)), 2);
		$dbh = $this->Post->getDataSource()->getConnection();
		$this->assertEquals($dbh->query('SELECT count(*) FROM posts_tags')->fetchColumn(), 3);

		## Post と posts_tags を１件追加
		$this->Post->create();
		$saved = $this->Post->save(array(
			'Post' => array(
				'title' => 'エントリ４',
				'body' => 'けけここ',
				'user_id' => 1,
				'category_id' => 2,
			),
			'Tag' => array(
				'Tag' => array(1),  # タグ２つなら 1, 2 とす
			),
		));
		$this->assertEquals($this->Post->find('count'), 4, 'posts 増えてる');
		$this->assertEquals($dbh->query('SELECT count(*) FROM posts_tags')->fetchColumn(), 4, 'posts_tags 増えてる');
		$res = $dbh->query('SELECT * FROM posts_tags WHERE post_id = ' . $saved['Post']['id'])->fetch();
		$this->assertEquals($res['post_id'], $this->Post->id);
		$this->assertEquals(1, $res['tag_id']);

		## それぞれの post_count 値が増えてる
		$this->assertEquals($this->Category->field('post_count', array('id'=>2)), 2);
		$this->assertEquals($this->User->field('post_count', array('id'=>1)), 3);

		## HABTM だと counterCache は機能しない模様。*_count 値は増えない
		$this->assertEquals($this->Tag->field('post_count', array('id'=>1)), 2, 'tags の post_count 増えない');
		$this->assertEquals($saved['Post']['tag_count'], 0, 'posts 側の tag_count も 0 のまま');
	}

	## 手動 transaction を試す
	## 注意: engine=MEMORY で create table される = transaction OFF なので
	## Fixture の create() 方で engine 指定が必要
	public function testTransaction() {
		## まず現状テーブル状態の確認
		$this->assertEquals($this->Post->find('count'), 3);
		$this->assertEquals($this->Tag->find('count'), 3);

		## レコード追加 without transaction
		$this->Post->save(array('user_id'=>1, 'category_id'=>1, 'title'=>'エントリ４'));
		$this->Tag->save(array('name'=>'foo'));

		## レコード数増える事を確認
		$this->assertEquals($this->Post->find('count'), 4);
		$this->assertEquals($this->Tag->find('count'), 4);

		## レコード追加 with transaction
		$this->Post->begin();
		$this->Post->save(array('user_id'=>1, 'category_id'=>1, 'title'=>'エントリ５'));
		$this->Tag->save(array('name'=>'bar'));
		$this->Post->rollback();

		## レコード数はどちらも増えていない
		## すなわち各 save() の中で commit() は呼ばれていない。
		## 上位層で begin|rollback 制御可能。
		$this->assertEquals($this->Post->find('count'), 4);
		$this->assertEquals($this->Tag->find('count'), 4);

		## if/else 分岐で rollback
		$this->Post->create();
		$this->Post->begin();
		if (!$this->Post->save(array('user_id'=>1)))
			$this->Post->rollback();
		$this->assertEquals($this->Post->find('count'), 4);  # 増えてない
	}

	## バリデーションを試す
	## http://book.cakephp.org/2.0/en/models/data-validation.html
	public function testValidate() {
		$data = array(
			'user_id' => 1,
			'category_id' => 1,
			'title' => 'エントリ４',
		);

		## 正常形
		$saved = $this->Post->save($data);
		$this->assertNotEmpty($saved);

		## validation fail させる
		$data2 = array_merge($data, array('category_id'=>'foo'));
		$this->assertEmpty($this->Post->save($data2));
		$err = $this->Post->validationErrors;
		#debug($err);
		$this->assertEquals('カテゴリは数字でね', $err['category_id'][0]);

		## 自前カスタムルール
		$data3 = array_merge($data, array('title'=>'あいうえお'));
		$this->assertEmpty($this->Post->save($data3));
		$err = $this->Post->validationErrors;
		$this->assertEquals('それはダメだな', $err['title'][0]);
	}

	public function testHabtmDependentDelete() {
		## まず現状テーブル状態の確認
		$this->assertNotEmpty($this->Post->findById(1));
		$dbh = $this->Post->getDataSource()->getConnection();
		$sql = 'SELECT count(*) FROM posts_tags WHERE post_id = 1';
		$this->assertEquals($dbh->query($sql)->fetchColumn(), 2);

		## Post を削除して件数を確認
		$this->assertTrue($this->Post->delete(1));
		$this->assertEmpty($this->Post->findById(1));
		## dependentDelete は HABTM では自動で有効
		$this->assertEquals($dbh->query($sql)->fetchColumn(), 0);

		## post_id = 2 に紐尽くレコードのみ残ってる
		$sql = 'SELECT count(*) FROM posts_tags';
		$this->assertEquals($dbh->query($sql)->fetchColumn(), 1);
	}

	public function tearDown() {
		unset($this->Post);
		parent::tearDown();
	}

}

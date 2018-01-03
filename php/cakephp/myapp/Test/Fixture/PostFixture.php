<?php

class PostFixture extends CakeTestFixture {

	public $import = 'Post';

	public $records = array(
		array(
			'id' => 1,
			'title' => 'エントリ１',
			'body' => 'ぼでー',
			'user_id' => 1,
			'category_id' => 1,
			'tag_count' => 2,
			'created' => '2011-12-26 00:04:22',
			'modified' => '2011-12-26 00:04:22'
		),
		array(
			'id' => 2,
			'title' => 'エントリ２',
			'body' => 'いいうえおあ',
			'user_id' => 2,
			'category_id' => 1,
			'tag_count' => 1,
			'created' => '2011-12-26 00:04:22',
			'modified' => '2011-12-26 00:04:22'
		),
		array(
			'id' => 3,
			'title' => 'エントリ３',
			'body' => 'かかかく',
			'user_id' => 1,
			'category_id' => 2,
			'tag_count' => 0,
			'created' => '2011-12-26 00:04:22',
			'modified' => '2011-12-26 00:04:22'
		),
	);

	## デフォルトだと engie=MEMORY で作って transaction テストが
	## 出来ないのでここで override
	function create($db) { 
		$this->fields['tableParameters']['engine'] = 'InnoDB'; 
		return parent::create($db);
	}
}

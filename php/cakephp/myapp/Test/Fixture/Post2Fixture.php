<?php

class Post2Fixture extends CakeTestFixture {

	public $import = 'Post2';

	public $records = array(
		array(
			'id' => 1,
			'title' => 'エントリ１',
			'body' => 'あいうえお',
			'tag2_count' => 2,
			'post2s_tag2_count' => 2,
			'created' => '2011-12-27 10:41:32',
			'modified' => '2011-12-27 10:41:32'
		),
		array(
			'id' => 2,
			'title' => 'エントリ２',
			'body' => 'かきくけこ',
			'tag2_count' => 1,
			'post2s_tag2_count' => 1,
			'created' => '2011-12-27 10:41:32',
			'modified' => '2011-12-27 10:41:32'
		),
		array(
			'id' => 3,
			'title' => 'エントリ３',
			'body' => 'さしすせそ',
			'tag2_count' => 0,
			'post2s_tag2_count' => 0,
			'created' => '2011-12-27 10:41:32',
			'modified' => '2011-12-27 10:41:32'
		),
	);
}

<?php

class Post2sTag2Fixture extends CakeTestFixture {

	public $import = 'Post2sTag2';

	public $records = array(
		array(
			'id' => 1,
			'post2_id' => 1,
			'tag2_id' => 1,
			'comment' => 'あれー',
		),
		array(
			'id' => 2,
			'post2_id' => 2,
			'tag2_id' => 1,
			'comment' => 'ほわー',
		),
		array(
			'id' => 3,
			'post2_id' => 1,
			'tag2_id' => 2,
			'comment' => 'うふぃー',
		),
	);
}

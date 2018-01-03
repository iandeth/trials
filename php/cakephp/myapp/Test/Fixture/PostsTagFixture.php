<?php
class PostsTagFixture extends CakeTestFixture {

	public $import = array('table'=>'posts_tags');

	public $records = array(
		array(
			'id' => 1,
			'post_id' => 1,
			'tag_id' => 1,  # Mac
		),
		array(
			'id' => 2,
			'post_id' => 2,
			'tag_id' => 1,
		),
		array(
			'id' => 3,
			'post_id' => 1,
			'tag_id' => 2,  # iPhone
		),
	);
}

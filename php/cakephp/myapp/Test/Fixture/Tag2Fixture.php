<?php

class Tag2Fixture extends CakeTestFixture {

	public $import = 'Tag2';

	public $records = array(
		array(
			'id' => 1,
			'name' => 'Mac',
			'post2_count' => 2,
			'post2s_tag2_count' => 2,
		),
		array(
			'id' => 2,
			'name' => 'iPhone',
			'post2_count' => 1,
			'post2s_tag2_count' => 1,
		),
		array(
			'id' => 3,
			'name' => 'Windows',
			'post2_count' => 0,
			'post2s_tag2_count' => 0,
		),
	);
}

<?php
class TagFixture extends CakeTestFixture {

	public $import = 'Tag';

	public $records = array(
		array(
			'id' => 1,
			'name' => 'Mac',
			'post_count' => 2,  # post 1, 2
		),
		array(
			'id' => 2,
			'name' => 'iPhone',
			'post_count' => 1,  # post 1
		),
		array(
			'id' => 3,
			'name' => 'Windows',
			'post_count' => 0,
		),
	);

	## デフォルトだと engie=MEMORY で作って transaction テストが
	## 出来ないのでここで override
	function create($db) { 
		$this->fields['tableParameters']['engine'] = 'InnoDB'; 
		return parent::create($db);
	}
}

<?php
App::uses('AppModel', 'Model');

class Post2 extends AppModel {

	public $displayField = 'title';

	public $hasMany = array(
		'Post2sTag2' => array(
			'className' => 'Post2sTag2',
			'foreignKey' => 'post2_id',
			'dependent' => true,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'exclusive' => '',
			'finderQuery' => '',
			'counterQuery' => ''
		)
	);
}

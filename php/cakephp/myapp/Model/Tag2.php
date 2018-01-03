<?php
App::uses('AppModel', 'Model');

class Tag2 extends AppModel {

	public $displayField = 'name';

	public $hasMany = array(
		'Post2sTag2' => array(
			'className' => 'Post2sTag2',
			'foreignKey' => 'tag2_id',
			'dependent' => false,
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

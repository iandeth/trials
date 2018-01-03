<?php
App::uses('AppModel', 'Model');

class Post2sTag2 extends AppModel {

	public $belongsTo = array(
		'Post2' => array(
			'className' => 'Post2',
			'foreignKey' => 'post2_id',
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'counterCache' => true,
		),
		'Tag2' => array(
			'className' => 'Tag2',
			'foreignKey' => 'tag2_id',
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'counterCache' => true,
		)
	);

}

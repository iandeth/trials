<?php
App::uses('AppModel', 'Model');

class Post extends AppModel {

	public $actsAs = array('Containable');
	public $displayField = 'title';

	public $validate = array(
		'title' => array(
			'notempty' => array(
				'rule' => 'notempty',
				'required' => true,
				'message' => 'タイトルを入れてください',
			),
			'length' => array(
				'rule' => array('maxLength', 150),
				'message' => 'タイトルは最大50文字までです',
			),
			'custom' => array(
				'rule' => array('myCustomRule', 'あいうえお'),
				'message' => 'それはダメだな',
			),
		),
		'user_id' => array(
			'notempty' => array(
				'rule' => 'notempty',
				'required' => true,
			),
			'numeric' => array(
				'rule' => array('numeric'),
				'required' => true,
				'allowEmpty' => false,
			),
		),
		'category_id' => array(
			'notempty' => array(
				'rule' => 'notempty',
				'required' => true,
				'message' => 'カテゴリを選んでください',
			),
			'numeric' => array(
				'rule' => array('numeric'),
				'required' => true,
				'allowEmpty' => false,
				'message' => 'カテゴリは数字でね',
			),
		),
	);

	public $belongsTo = array(
		'User' => array(
			'className' => 'User',
			'foreignKey' => 'user_id',
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'counterCache' => true,
		),
		'Category' => array(
			'className' => 'Category',
			'foreignKey' => 'category_id',
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'counterCache' => true,
		)
	);

	public $hasAndBelongsToMany = array(
		'Tag' => array(
			'className' => 'Tag',
			'joinTable' => 'posts_tags',
			'foreignKey' => 'post_id',
			'associationForeignKey' => 'tag_id',
			'unique' => true,
			'conditions' => '',
			'fields' => '',
			'order' => '',
			'limit' => '',
			'offset' => '',
			'finderQuery' => '',
			'deleteQuery' => '',
			'insertQuery' => '',
			'counterCache' => true,  # これ habtm では機能しない
		)
	);

	function myCustomRule($check, $ng_text) {
		#debug($check);
		$val = array_values($check);
		$val = $val[0];  # 実際ユーザーが入力した値
		return ($val === $ng_text)? false : true;
	}

	## Auth 認証 - 所有者かどうか
	public function isOwnedBy($post, $user) {
		return $this->field('id', array('id'=>$post, 'user_id'=>$user)) === $post;
	}

}

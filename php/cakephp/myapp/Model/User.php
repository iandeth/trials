<?php
App::uses('AppModel', 'Model');
App::uses('AuthComponent', 'Controller/Component');

class User extends AppModel {

	public $validate = array(
		'username' => array(
			'notempty' => array(
				'rule' => array('notempty'),
				'required' => true,
				'message' => 'ユーザー名を入れてください',
				// 'allowEmpty' => false,
				//'last' => false, // Stop validation after this rule
				//'on' => 'create', // Limit validation to 'create' or 'update' operations
			),
			'alphanum' => array(
				'rule' => '/^[a-zA-Z0-9]+$/',
				'message' => 'ユーザー名は英数字で入力してください',
			),
		),
		'password' => array(
			'notempty' => array(
				'rule' => array('notempty'),
				'required' => true,
				'message' => 'パスワードを入れてください',
				'on' => 'create',
			),
			'minlen' => array(
				'rule' => array('minLength', 6),
				'message' => 'パスワードは最低 6 文字必要です',
			),
			'ascii' => array(
				'rule' => '/^[!-~]+$/',
				'message' => 'パスワードは英数字・記号のみで入力してください',
			),
		),
		'email' => array(
			'notempty' => array(
				'rule' => array('notempty'),
				'required' => true,
				'message' => 'メールアドレスを入れてください',
			),
			'email' => array(
				'rule' => 'email',
				'message' => 'メールアドレスの形式が不正です',
			),
			'unique' => array(
				'rule' => 'isUnique',
				'message' => 'そのメールアドレスは既に登録済みです',
			),
		),
		'role' => array(
			'rule' => array('inList', array('user', 'admin')),
			'message' => '権限を指定してください',
			'required' => true,
			'allowEmpty' => false,
		),
		'active' => array(
			'rule' => array('inList', array(1, 0)),
			'message' => '有効フラグを指定してください',
			'required' => true,
			'allowEmpty' => false,
		),
	);

	public $hasMany = array(
		'Post' => array(
			'className' => 'Post',
			'foreignKey' => 'user_id',
			'dependent' => true,  # User 消すと所有 Post も全部自動で消える
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

	## パスワード保存の際に hash 化
	public function beforeSave() {
		if (isset($this->data['User']['password']))
			$this->data['User']['password'] = AuthComponent::password($this->data['User']['password']);
		return true;
	}

	## 現パスワードの認証と新パスワード確認入力の validation つきで
	## パスワードを更新する。
	## 引数: $data=array('User'=>array('password'=>'x', 'passconf'=>'y', 'passnow'=>'z')) 
	## な形の array ($ctrl->request->data そのまま渡せば OK)
	## $mode=動作種別 (1=パスワード変更、2=パスワード再発行 [現在パスワード確認ナシ])
	public function updatePassword($data, $mode=1){
		## 現 validation rule を退避
		$vold = $this->validate;
		## 今回限りの custom validation を設定
		$fields = array('password', 'passconf');
		$validate = array(
			'password' => $vold['password'],
			'passconf' => array(
				'rule' => 'validatePassConfirm',
				'message' => 'パスワードと一致しません',
				'required' => true,
				'allowEmpty' => false,
			),
		);
		## パスワード変更の場合は現在パスワードのチェックもする
		if ($mode == 1) {
			$fields[] = 'passnow';
			$validate['passnow'] = array(
				'rule' => 'validatePassNow',
				'message' => '現在パスワードが間違っています',
				'required' => true,
				'allowEmpty' => false,
			);
		}
		$this->validate = $validate;
		$this->set($data['User']);
		if (!$this->validates(array('fieldList'=>$fields)))
			return false;
		$res = $this->saveField('password', $data['User']['password']);
		## validation rule 元に戻しておく
		$this->validate = $vold;
		return $res;
	}

	## パスワード変更時の validation - 確認用パスワード入力
	function validatePassConfirm($check) {
		$val = array_values($check);
		$val = $val[0];
		## 入力パスワードと一致するなら OK
		if ($val === $this->data['User']['password'])
			return true;
		return false;
	}

	## パスワード変更時の validation - 現在パスワード認証
	function validatePassNow($check) {
		$val = array_values($check);
		$hashed = AuthComponent::password($val[0]);
		## 現在パスワードが valid なら OK
		if ($hashed === $this->field('password'))
			return true;
		return false;
	}
}

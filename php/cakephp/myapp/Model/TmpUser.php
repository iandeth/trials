<?php
App::uses('AppModel', 'Model');
App::import('Vendor',  'Model/Behavior/SerializableBehavior');

class TmpUser extends AppModel {

	var $actsAs = array(
		## 指定 fields を自動で json en|decode してくれる
		## ただし validate required=>true にしてると
		## validation error になるので注意。
		'Serializable' => array('fields'=>array('data'))
	);

	public $validate = array(
		'hash' => array(
			'rule' => 'notempty',
			'required' => true,
		),
		'wtype' => array(
			'rule' => array('inList', array(1, 2, 3)),
			'required' => true,
		),
		## 以下があると Serializable Behavior が動かん
		# 'data' => array(
		# 	'rule' => 'notempty',
		# 	'required' => true,
		# ),
	);

	## ユーザー登録情報を元に hash 値を生成して tmp_users に新規レコード作成する
	## 引数: 0=Users::save() の第一引数に渡す $ctrl->request->data array
	##       1=Action種別 (1=ユーザー新規登録, 2=メアド変更, 3=パスワード再設定)
	##       2=$this->save() に渡すオプション引数
	## 戻値: $this->save() の戻り値
	public function saveNew(array $request_data_user, $wtype=1, array $opt=array()) {
		$data = array('TmpUser'=>array(
			'hash' => $this->createHash($request_data_user),
			'wtype' => $wtype,
			'data' => $request_data_user,
		));
		array_unshift($opt, $data);
		return call_user_func_array(array($this, 'save'), $opt);
	}

	## メール確認時の confirm url 用 hash 値を生成
	## 引数: 0=ユーザーが入力した users table 登録情報
	## 戻値: hash string
	protected function createHash(array $data) {
		$user = $data['User'];
		if (!isset($user))
			throw new CakeException('$data が空っぽ');
		$raw = $user['email'] . time();
		return Security::hash($raw);
    }

}

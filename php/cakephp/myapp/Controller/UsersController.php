<?php
App::uses('AppController', 'Controller');
App::uses('CakeEmail', 'Network/Email');

class UsersController extends AppController {

	public $uses = array('User', 'TmpUser');

	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow(
			'login', 'logout', 'add', 'add_mail_sent', 'add_mail_confirmed',
			'add2', 'add2_confirm', 'add2_complete',
			'password_forgot', 'password_forgot_mail_sent', 'password_forgot_confirmed'
		);
	}

	## Auth - User x Action 認証
	public function isAuthorized($user) {
		## role=admin なら OK
		if (parent::isAuthorized($user))
			return true;
		## これら Action はログインさえしていれば OK
		if (in_array($this->action, array(
			'index', 'edit', 'password', 
			'email', 'email_mail_sent', 'email_mail_confirmed',
			'delete',
		))){ return true; }
		return false;
	}

	public function login() {
		if (!$this->request->is('post'))
			return;
		if (!$this->Auth->login()){
			$this->Session->setFlash('ユーザー名かパスワードが間違っています');
			## パスワード入力は fill-in-form させない
			$this->request->data['User']['password'] = null;
			return;
		}
		$this->Session->setFlash('ようこそ！', 'flash_green');
		$this->redirect($this->Auth->redirect());
	}

	public function logout() {
		$this->Session->setFlash('ログアウトしました', 'flash_green');
		$this->redirect($this->Auth->logout());
	}

	public function add() {
		if (!$this->request->is('post'))
			return;
		## 入力情報が users table validation を通るなら
		## メール確認用の tmp table に情報を格納、確認メール送る
		$this->User->create($this->request->data);
		if (!$this->User->validates()) {
			$this->Session->setFlash('入力エラーがあります');
			return;
		}
		## tmp table に保存
		if (!$saved = $this->TmpUser->saveNew($this->User->data, 1)) {
			$this->log($this->TmpUser->validationErrors, 'error');
			throw new InternalErrorException('登録エラー');
		}
		## メール送信
		$m = new CakeEmail('default');
		$m ->emailFormat('text')
			->template('user_add_confirm', 'default')
			->viewVars(array(
				'user' => $this->User->data['User'],
				'hash' => $saved['TmpUser']['hash'],
			))
			->subject('CakePHP サンプルコード - ユーザー登録確認')
			->to(
				$this->User->data['User']['email'], 
				$this->User->data['User']['username'] . 'さん'
			);
		$mail = $m->send();
		$this->Session->write('User.mail', $mail);
		## 完了画面にリダイレクト
		$this->Session->setFlash('登録確認メールが送られました', 'flash_green');
		$this->redirect(array('action'=>'add_mail_sent'));
	}

	public function add_mail_sent() {
		$this->set('mail', $this->Session->read('User.mail'));
		$this->Session->delete('User.mail');
	}

	public function add_mail_confirmed($hash=null) {
		if (!$row = $this->TmpUser->findByHashAndWtype($hash, 1))
			return;
		$row = $row['TmpUser'];
		if (!$this->User->save($row['data'])) {
			$this->log($this->User->validationErrors, 'error');
			throw new InternalErrorException('登録エラー');
		}
		## TmpUser からレコード削除
		if (!$this->TmpUser->delete($row['id'])){
			$this->log($this->TmpUser->validationErrors, 'error');
			throw new InternalErrorException('登録エラー');
		}
		## 別のユーザーでログインしているかも、なので強制ログアウト
		$this->Auth->logout();
		## 登録ユーザーでログイン状態にする
		$user = $this->User->read();
		$this->Auth->login($user['User']);
		$this->Session->setFlash('ユーザー登録が正常に完了しました。ようこそ！', 'flash_green');
		$this->redirect(array('action'=>'index'));
	}

	public function index() {
		$this->set('user', $this->Auth->user());
	}

	public function edit() {
		$user = $this->User->findById($this->Auth->user('id'));
		$this->set('email', $user['User']['email']); # 表示 only 用
		if (!$this->request->is('post') && !$this->request->is('put')) {
			$this->request->data = $user;
			return;
		}
		## 第三引数で更新対象の field を指定する事で編集非対象項目の
		## validation が走らないで済む
		$this->User->id = $this->Auth->user('id');
		if (!$this->User->save($this->request->data, true, array('username', 'role'))) {
			$this->Session->setFlash('入力エラー');
			return;
		}
		## 情報変更あったのでログイン情報を更新する
		$user = $this->User->read();
		$this->Auth->login($user['User']);
		$this->Session->setFlash('更新しました', 'flash_green');
	}

	public function password() {
		$this->User->id = $this->Auth->user('id');
		if (!$this->request->is('post') && !$this->request->is('put'))
			return;
		if (!$this->User->updatePassword($this->request->data)) {
			$this->request->data['User']['passconf'] = null;
			$this->Session->setFlash('入力エラー');
			return;
		}
		## 情報変更あったのでログイン情報を更新する
		$user = $this->User->read();
		$this->Auth->login($user['User']);
		$this->Session->setFlash('パスワードを更新しました', 'flash_green');
		$this->redirect(array('action'=>'index'));
	}

	public function email() {
		$this->request->data['User']['id'] = $this->Auth->user('id');
		$this->set('emailnow', $this->Auth->user('email'));
		if (!$this->request->is('post') && !$this->request->is('put'))
			return;
		## 新メールアドレスの validation
		$this->User->set($this->request->data);
		if (!$this->User->validates(array('fieldList'=>array('email')))){
			$this->Session->setFlash('入力エラー');
			return;
		}
		## TmpUser テーブルに一旦保存
		if (!$saved = $this->TmpUser->saveNew($this->request->data, 2)){
			$this->log($this->TmpUser->validationErrors, 'error');
			throw new InternalErrorException('変更エラー');
		}
		## 確認メール送信
		$m = new CakeEmail('default');
		$m ->emailFormat('text')
			->template('user_email_confirm', 'default')
			->viewVars(array(
				'user' => $this->Auth->user(),
				'hash' => $saved['TmpUser']['hash'],
			))
			->subject('CakePHP サンプルコード - メールアドレス変更確認')
			->to(
				$this->User->data['User']['email'], 
				$this->Auth->user('username') . 'さん'
			)
			->send();
		## 完了画面にリダイレクト
		$this->Session->setFlash('確認メールが送られました', 'flash_green');
		$this->redirect(array('action'=>'email_mail_sent'));
	}

	public function email_mail_sent() {}

	public function email_mail_confirmed($hash=null) {
		if (!$row = $this->TmpUser->findByHashAndWtype($hash, 2))
			return;
		$row = $row['TmpUser'];
		if (!$this->User->save($row['data'], true, array('email'))) {
			$this->log($this->User->validationErrors, 'error');
			throw new InternalErrorException('変更エラー');
		}
		## TmpUser からレコード削除
		if (!$this->TmpUser->delete($row['id'])){
			$this->log($this->TmpUser->validationErrors, 'error');
			throw new InternalErrorException('変更エラー');
		}
		## メアド変更あったのでログイン情報を更新する
		$user = $this->User->read();
		$this->Auth->login($user['User']);
		$this->Session->setFlash('メールアドレスが変更されました', 'flash_green');
		$this->redirect(array('action'=>'edit'));
	}

	public function delete() {
		if (!$this->request->is('post'))
			return;
		$this->User->id = $this->Auth->user('id');
		if (!$this->User->delete()) {
			$this->log($this->User->validationErrors, 'error');
			throw new InternalErrorException('削除エラー');
		}
		$this->Auth->logout();
		$this->Session->setFlash('退会処理が完了しました');
		$this->redirect(array('controller'=>'users', 'action'=>'login'));
	}

	## ユーザー登録 - 確認画面遷移版サンプル - 入力
	public function add2() {
		if (!$this->request->is('post')){
			if ($data = $this->Session->read('User.add2'))
				$this->request->data = $data;
			return;
		}
		$this->User->create($this->request->data);
		if (!$this->User->validates()) {
			$this->Session->setFlash('入力エラーがあります');
			return;
		}
		$this->Session->write('User.add2', $this->User->data);
		$this->redirect(array('action'=>'add2_confirm'));
	}

	## ユーザー登録 - 確認画面遷移版サンプル - 確認
	public function add2_confirm() {
		if (!$this->Session->check('User.add2'))
			$this->redirect(array('action'=>'add2'));
		if (!$this->request->is('post'))
			return;
		## 戻るボタン押した場合
		if (isset($this->request->data['_back']))
			$this->redirect(array('action'=>'add2'));
		$this->redirect(array('action'=>'add2_complete'));
	}

	## ユーザー登録 - 確認画面遷移版サンプル - 完了
	public function add2_complete() {
		if (!$data = $this->Session->read('User.add2'))
			$this->redirect(array('action'=>'add2'));
		## もう一度 model validation
		$this->User->create($data);
		if (!$this->User->validates()) {
			$this->Session->setFlash('入力エラーがあります');
			$this->redirect(array('action'=>'add2'));
		}

		##
		## ここで本来なら保存処理等を書く
		##

		## 最後に不要な session data を消す
		$this->Session->delete('User.add2');
	}

	## パスワード忘れ再発行 - メールアドレス入力フォーム
	public function password_forgot() {
		if (!$this->request->is('post') && !$this->request->is('put'))
			return;
		$m =& $this->User;
		$rd =& $this->request->data;
		## validation
		$email = (isset($rd['User']['email']))? $rd['User']['email'] : null;
		$vali = new Validation();
		if (!$vali->notEmpty($email)){
			$m->validationErrors['email'] = array('入力してください');
			$this->Session->setFlash('入力エラー');
			return;
		}
		if (!$vali->email($email)){
			$m->validationErrors['email'] = array('不正なメールアドレスの形式です');
			$this->Session->setFlash('入力エラー');
			return;
		}
		## メールアドレスからユーザーを探す
		## 存在しなかった場合は後続処理せずに完了画面をシレーっと表示して終了
		if (!$user = $m->findByEmail($email))
			$this->redirect(array('action'=>'password_forgot_mail_sent'));
		## TmpUser テーブルに一旦保存
		$data = array('User'=>array(
			'id' => $user['User']['id'],
			'email' => $email,
		));
		if (!$saved = $this->TmpUser->saveNew($data, 3)){
			$this->log($this->TmpUser->validationErrors, 'error');
			throw new InternalErrorException('保存エラー');
		}
		## 確認メール送信
		$m = new CakeEmail('default');
		$m ->emailFormat('text')
			->template('password_forgot', 'default')
			->viewVars(array(
				'user' => $user,
				'hash' => $saved['TmpUser']['hash'],
			))
			->subject('CakePHP サンプルコード - パスワード再発行確認')
			->to($email);
		$mail = $m->send();
		$this->Session->write('User.mail', $mail);
		## 完了画面にリダイレクト
		$this->Session->setFlash('確認メールが送られました', 'flash_green');
		$this->redirect(array('action'=>'password_forgot_mail_sent'));
	}

	## パスワード忘れ再発行 - 確認メール送信完了
	public function password_forgot_mail_sent() {
		$this->set('mail', $this->Session->read('User.mail'));
		$this->Session->delete('User.mail');
	}

	## パスワード忘れ再発行 - メール承認 + パスワード再設定フォーム画面
	public function password_forgot_confirmed($hash=null) {
		if (!$this->request->is('post') && !$this->request->is('put')) {
			## メール承認 OK session key があらばフォーム画面を表示
			if ($this->Session->check('User.password_forgot'))
				return;
			## hash string での承認処理
			if (!$row = $this->TmpUser->findByHashAndWtype($hash, 3)) {
				$this->Session->setFlash('無効な URL です。再度メールアドレス確認を行ってください');
				$this->redirect(array('action'=>'password_forgot'));
				return;
			}
			$row = $row['TmpUser'];
			## 承認 OK session key セット
			$this->Session->write('User.password_forgot', $row['data']);
			## temp table record 削除
			$this->TmpUser->delete($row['id']);
			return;
		}
		## Session key validation
		if (!$data = $this->Session->read('User.password_forgot'))
			$this->redirect(array('action'=>'password_forgot'));
		## パスワード更新
		$this->User->id = $data['User']['id'];
		if (!$this->User->updatePassword($this->request->data, 2)) {
			$this->request->data['User']['passconf'] = null;
			$this->Session->setFlash('入力エラー');
			return;
		}
		## ログイン状態にする
		$user = $this->User->read();
		$this->Auth->login($user['User']);
		$this->Session->setFlash('パスワードを再設定しました', 'flash_green');
		## チェック Session 削除
		$this->Session->delete('User.password_forgot');

		$this->redirect(array('action'=>'index'));
	}
}

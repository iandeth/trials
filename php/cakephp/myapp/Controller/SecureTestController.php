<?php
App::uses('AppController', 'Controller');

class SecureTestController extends AppController {

	public $components = array('Security');

	function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('*');

		$this->Security->blackHoleCallback = 'securityCallback';
		$this->Security->requireSecure();
	}

	## Security エラー検知された際のコールバック
	## これを親クラスの AppController 等に定義しても動作 OK
	function securityCallback($type) {
		if ($type ==  'secure') {
			## HTTP でアクセスが来たら HTTPS にリダイレクトさせる方法。
			## MAMP 環境で HTTP=8888, HTTPS=8887 port で動作させている関係で
			## port 番号の変換が必要
			$host = preg_replace('/8888$/', '8887', $this->request->host());
			$this->redirect('https://' . $host . $this->here);
		} else if ($type === 'csrf') {
			$this->Session->setFlash('2重送信は無効です。もう一度入力してください');
			$this->redirect($this->here);
		}
	}

	function index() {}

	function sample_form() {
		if ($this->request->is('post'))
			$this->Session->setFlash('登録しました。ここでブラウザのリロード ' .
			'(=再度フォーム送信) をすると、CSRF エラーが発生する。', 'flash_green');
	}
}

<?php
App::uses('AppController', 'Controller');

class TrialsController extends AppController {

	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('*');
	}

	public function index() {}

	public function debug() {
		$obj = array(
			'foo' => array(
				'key1' => 'あいう',
				'key2' => 'えおか',
			),
			'bar' => 'バー',
		);

		## その１
		debug($obj);
		## その２
		pr($obj);
		## その３ (php 標準形)
		var_dump($obj);
	}

	public function layouts() {
		## Layout 指定
		$this->layout = 'foo';
	}

	public function elements() {}

	## JSON レスポンス
	## 別途 view file 不要
	## http://www.thelittlebakery.org/2011/10/json-reponse-from-controller-action-cakephp2/
	public function as_json() {
		$obj = array('bar'=>'バー');
		return new CakeResponse(array(
			'type' => 'json', 
			'body' => json_encode($obj),
		));
	}

	## JSONP レスポンス
	## 別途 View/Trials/as_jsonp.ctp も必要
	public function as_jsonp() {
		## Layout 不要にして、response content type をセット
		$this->layout = false;  # or 'ajax'
		$this->response->type('json');

		$obj = array(
			'foo' => array(
				'key1' => 'あいう',
				'key2' => 'えおか',
			),
			'bar' => 'バー',
		);
		$this->set('data', $obj);

		$cb = 'callback';
		## ちょこっと sanitize
		if (isset($this->request->query['callback']))
			$cb = preg_replace('/[(); ]/', '', $this->request->query['callback']);
		$this->set('callback', $cb);

	}

	public function custom_route_action($user_id=null, $post_id=null) {
		debug(func_get_args());
	}

}

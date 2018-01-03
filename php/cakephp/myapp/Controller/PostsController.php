<?php
class PostsController extends AppController {

	public $uses = array('Post');
	public $helpers = array('Time');

	public function beforeFilter() {
		parent::beforeFilter();
		$this->Auth->allow('view');
	}

	## Auth - User x Action 認証
	public function isAuthorized($user) {
		## role=admin なら OK
		if (parent::isAuthorized($user))
			return true;
		## これら Action はログインさえしていれば OK
		$actions = array(
			'index', 'add', 
			'add_ajax', 'add_ajax_save',
		);
		if (in_array($this->action, $actions))
			return true;
		## 所有者なら OK
		if (in_array($this->action, array('edit', 'delete'))) {
			if (!isset($this->request->params['pass'][0]))
				return false;
			$post_id = $this->request->params['pass'][0];
			return $this->Post->isOwnedBy($post_id, $user['id']);
		}
		return false;
	}

	public function index() {
		## 隠れ GET パラメータ ?create=$i なら $i 数分
		## エントリを作成する。ページングのテスト用
		if (
			isset($this->request->query['create']) && 
			$cnt = intval($this->request->query['create']) > 0
		){
			$uid = $this->Auth->user('id');
			for ($i=1; $i<=$cnt; $i++){
				$this->Post->create(array(
					'title' => "タイトル $i",
					'body'  => "本文 $i",
					'user_id' => $uid,
					'category_id' => rand(1, 3),
				));
				if (!($i % 20))
					sleep(1);  # 作成日時をずらす
				$this->Post->save();
			}
			$this->redirect(array('action'=>'index'));
		}

		## 一覧表示
		$this->paginate = array(  # 条件を設定
			'limit' => 20,
			'contain' => 'Category',
			'conditions' => array('user_id'=>$this->Auth->user('id')),
			'fields' => array('Post.id', 'Post.title', 'Post.created', 'Category.name'),
			'order' => 'Post.id DESC',
		);
		$this->set('posts', $this->paginate('Post'));
	}

	public function view($id=null) {
		$post = $this->Post->find('first', array(
			'contain' => array('Category', 'User', 'Tag'),
			'conditions' => array('Post.id'=>$id),
			'fields' => array('Post.*', 'Category.name', 'User.username'),
		));
		if (!$post)
			throw new NotFoundException('該当エントリはありません');
		$this->set('post', $post);
	}

	public function add() {
		## カテゴリ選択プルダウン用
		$this->set('categories', $this->Post->Category->find('list'));
		## タグ指定チェックボックス用
		$this->set('tags', $this->Post->Tag->find('list'));

		if (!$this->request->is('post'))
			return;
		$this->Post->set(array('user_id'=>$this->Auth->user('id')));
		if (!$this->Post->save($this->request->data)) {
			$this->Session->setFlash('入力エラーがあります');
			return;
		}
		$this->Session->setFlash('エントリを新規作成しました', 'flash_green');
		$this->redirect(array('action'=>'index'));
	}

	function edit($id=null) {
		## カテゴリ選択プルダウン用
		$this->set('categories', $this->Post->Category->find('list'));
		## タグ指定チェックボックス用
		$this->set('tags', $this->Post->Tag->find('list'));

		$this->Post->id = $id;
		if (!$this->request->is('post') && !$this->request->is('put')) {
			$this->Post->contain('Tag');
			$row = $this->Post->read();
			if (!$row)
				throw new NotFoundException('該当エントリはありません');
			$this->request->data = $row;
			return;
		}
		$opt = array('category_id', 'title', 'body');
		if (!$this->Post->save($this->request->data, true, $opt)) {
			$this->Session->setFlash('入力エラー');
			return;
		}
		$this->Session->setFlash('エントリが更新されました', 'flash_green');
	}

	public function delete($id=null) {
		if (!$this->request->is('post'))
			throw new BadRequestException('不正なアクセスです');
		if (!$this->Post->delete($id)) {
			$this->log($this->Post->validationErrors, 'error');
			throw new InternalErrorException('削除エラー');
		}
		$this->Session->setFlash('エントリを削除しました', 'flash_green');
		$this->redirect(array('action'=>'index'));
	}

	## add の AJAX 実装版 - 入力画面
	public function add_ajax() {
		## カテゴリ選択プルダウン用
		$this->set('categories', $this->Post->Category->find('list'));
		## タグ指定チェックボックス用
		$this->set('tags', $this->Post->Tag->find('list'));

		if (!$this->request->is('post'))
			return;
		$this->Post->set(array('user_id'=>$this->Auth->user('id')));
		if (!$this->Post->save($this->request->data)) {
			$this->Session->setFlash('入力エラーがあります');
			return;
		}
		$this->Session->setFlash('エントリを新規作成しました', 'flash_green');
		$this->redirect(array('action'=>'index'));
	}

	## add の AJAX 実装版 - XHR 保存処理
	public function add_ajax_save() {
		#$this->log($this->request->data, 'debug');
		$ret = array('is_success'=>false);

		$this->Post->set(array('user_id'=>$this->Auth->user('id')));
		if (!$this->Post->save($this->request->data)) {
			## エラーレスポンス
			$this->set('categories', $this->Post->Category->find('list'));
			$this->set('tags', $this->Post->Tag->find('list'));
			$ret['html'] = $this->render('/Elements/post_form_ajax', false)->body(null);
			$ret['error'] = $this->Post->validationErrors;
			$ret['data'] = $this->request->data;
		} else {
			## 成功レスポンス
			$this->Session->setFlash('エントリを新規作成しました', 'flash_green');
			$ret['is_success'] = true;
			$ret['id'] = $this->Post->id;
		}
		return new CakeResponse(array(
			'type' => 'json', 
			'body' => json_encode($ret),
		));
	}

}

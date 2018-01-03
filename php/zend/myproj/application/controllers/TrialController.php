<?php
require_once 'MyProj/Controller/Action.php';

class TrialController extends MyProj_Controller_Action
{
    public function init() {
        parent::init();

        ## canjsonAction() 用
        $csw = $this->_helper->getHelper('contextSwitch');
        $csw->addActionContext('canjson', 'json')->initContext();
    }

    public function indexAction() {
        $this->_redirect('/');
    }

    public function sessionAction() {
        ## ページタイトル
        $this->view->headTitle()->prepend('セッション');

        ## セッションお試し
        $s = new Zend_Session_Namespace();
        isset($s->viewCount)?
            $s->viewCount++ : $s->viewCount = 1;
        $this->view->viewCount = $s->viewCount;
    }

    public function canjsonAction() {
        ## JSON レスポンスお試し
        ## init() で contextSwith 宣言すると ?format=json とか
        ## /trial/canjson/format/json が可能に
        $this->view->foo = 'ワールド';
        $this->view->bar = array('a'=>1, 'b'=>2);
    }

    public function viewjsonAction() {
        ## JSON レスポンスお試し その２
        ## JSON viewHelper を使って JSON レスポンス
        ## これだと別途 view.phtml を使って
        ## 好きに render 内容決められる (eg: JSONP したいとき)
        $this->view->data = array(
            'foo' => 'ワールド',
            'bar' => array('a'=>1, 'b'=>2),
        );
    }

    public function actionjsonAction() {
        ## JSON レスポンスお試し その３
        ## JSON ActionHelper を使って JSON レスポンス
        ## これが一番簡潔。
        $data = array(
            'foo' => 'ワールド',
            'bar' => array('a'=>1, 'b'=>2),
        );
        $this->_helper->json($data);
    }

    public function fooBarAction() {
        ## camel なアクションは /trial/foo-bar に URL 変換。
        ## URL: foo_bar は foobar と解釈されるので注意。
        ## view script は foo-bar.phtml になる。tricky.
    }

    public function flashmAction() {
        $fm = $this->_helper->flashMessenger;
        ## session 使った flash message
        if( $this->_getParam('_flash') ){
            $fm->addMessage('Flash Message だよ。画面リロードすると消えるよ');
            $this->view->fmsg_set_ok = 1;
        }else{
            $this->view->fmsgs = $fm->getMessages();
        }
    }

    public function addedRouteAction() {
        $this->view->name = $this->_getParam('name');
        $this->view->id   = $this->_getParam('id');
    }

    public function changeViewAction() {
        ## layout を OFF にする
        $this->_helper->layout->disableLayout();

        ## 本来は change-view.phtml が render されるが
        ## これを変更する
        $this->_helper->viewRenderer->setRender('change-view2');
    }

    public function configAction() {
        ## config/application.ini の内容を取得する
        ## 全部取得
        $this->view->options = $this->getInvokeArg('bootstrap')->getOptions();

        ## 一部取得
        $this->view->phpopt = $this->getInvokeArg('bootstrap')->getOption('phpSettings');
    }

    public function logAction() {
        $log = $this->getInvokeArg('bootstrap')->getResource('log');
        $log->info('インフォです short');
    }

    public function cacheAction() {
        $c = $this->getInvokeArg('bootstrap')->getResource('cachemanager')->getCache('foo');
        ## キャッシュに保存
        if ($this->_getParam('_save')){
            $obj = array('text' => $this->_getParam('text'));
            $c->save($obj, 'pkey');
        }
        ## キャッシュから読込
        if ($obj = $c->load('pkey'))
            $this->view->text = $obj['text'];
    }
}


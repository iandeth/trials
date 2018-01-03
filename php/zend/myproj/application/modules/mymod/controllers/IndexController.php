<?php
require_once 'MyProj/Controller/Action.php';

class Mymod_IndexController extends MyProj_Controller_Action
{
    public function init() {
        parent::init();
        $this->view->headTitle()->append('マイモッド');
    }

    public function indexAction() {}

    public function fooAction()
    {
        $this->view->foo = 'マイモッドフー';
    }

}


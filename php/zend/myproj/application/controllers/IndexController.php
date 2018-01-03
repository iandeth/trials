<?php
require_once 'MyProj/Controller/Action.php';

class IndexController extends MyProj_Controller_Action
{
    public function init() {
        parent::init();
    }

    public function indexAction() {
        ## view stash
        $this->view->foo = 'ワールド';
    }
}

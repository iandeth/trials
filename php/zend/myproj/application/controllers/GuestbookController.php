<?php
require_once 'MyProj/Controller/Action.php';

class GuestbookController extends MyProj_Controller_Action
{
    public function init() {
        parent::init();
    }

    public function indexAction()
    {
        $gb = new MyProj_Model_DbTable_Guestbook();
        $this->view->guests = $gb->fetchAll();
    }
}


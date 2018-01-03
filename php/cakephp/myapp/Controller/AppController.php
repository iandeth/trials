<?php
App::uses('Controller', 'Controller');

class AppController extends Controller {

    public $helpers = array('Session', 'Html', 'Form');

	public $components = array(
		'Session',
		'Auth' => array(
            'loginRedirect'  => array('controller'=>'users', 'action'=>'index'),
            'logoutRedirect' => array('controller'=>'users', 'action'=>'login'),
			'authError' => 'ログインが必要です',
			'authorize' => array('Controller'),
			'authenticate' => array(
				'Form' => array('fields'=>array('username'=>'email')),
			),
        ),
	);

	## Auth Handler - admin は全許可
	public function isAuthorized($user) {
		if (isset($user['role']) && $user['role'] === 'admin')
			return true;
		return false;
	}
}

<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/learning.multiuser.authorization.html
# http://framework.zend.com/manual/en/zend.auth.html

## table and data to use
# CREATE TABLE users (
#   id int auto_increment,
#   username VARCHAR(50) UNIQUE NOT NULL,
#   password VARCHAR(32) NULL,
#   real_name VARCHAR(150) NULL,
#   enabled bool,
#   PRIMARY KEY (`id`)
# );
#
# INSERT INTO users VALUES( null, 'ian', MD5('ian'), '石橋', 1 );
#
# CREATE TABLE session (
#   id char(32),
#   modified int,
#   lifetime int,
#   data text,
#   PRIMARY KEY (`id`)
# );

## エラーメッセージ日本語化 - 効かない orz
Zend_Locale::setDefault('ja_JP');
$loc = new Zend_Locale('ja_JP');
$tr = new Zend_Translate(array(
    'adapter' => 'array',
    'content' => APP_ROOT.'/ZendFramework/resources/languages/ja/Zend_Validate.php',
    'locale'  => $loc
));
Zend_Registry::set('Zend_Locale', $loc);
Zend_Registry::set('Zend_Translate', $tr);


## session setup
$db = Zend_Db::factory( $conf->database );
Zend_Db_Table_Abstract::setDefaultAdapter( $db );
$sh = new Zend_Session_SaveHandler_DbTable(array(
    'name'           => 'session',
    'primary'        => 'id',
    'modifiedColumn' => 'modified',
    'dataColumn'     => 'data',
    'lifetimeColumn' => 'lifetime',
    'lifetime'       => 2880,   # seconds
));
Zend_Session::setSaveHandler( $sh );


## view 初期化
$view = new Zend_View(array('scriptPath' => APP_ROOT.'/view'));


## auth form
$form = new Zend_Form(array('action'=>'', 'method'=>'post'));
$form->addElement('text', 'username', array(
    'label'    => 'ユーザー名:',
    'required' => true,
    'filters'  => array('StringTrim'),
))->addElement('password', 'password', array(
    'label'    => 'パスワード:',
    'required' => true,
))->addElement('submit', 'submit', array(
    'label'    => 'Login',
));
$form->setView($view);


## validate
if( array_keys($_POST) && $form->isValid($_POST) ){
    $a = new Zend_Auth_Adapter_DbTable(
        $db, 'users', 'username', 'password',
        'MD5(?) AND enabled = 1'
    );
    $v = $form->getValues();
    $a->setIdentity($v['username']);
    $a->setCredential($v['password']);

    $auth = Zend_Auth::getInstance();
    $res  = $auth->authenticate($a);
    if( $res->isValid() ){
        header("Location: /auth-ok.php");
        exit;
    }
    $view->auth_res = $res;
}else{
    $view->errors = $form->getMessages();
}


## view render
$view->form = $form;
echo $view->render('auth.php');

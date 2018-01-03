<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/learning.multiuser.authorization.html


## session setup
$db = Zend_Db::factory( $conf->database );
Zend_Db_Table_Abstract::setDefaultAdapter( $db );
$sh = new Zend_Session_SaveHandler_DbTable(array(
    'name'           => 'session',
    'primary'        => 'id',
    'modifiedColumn' => 'modified',
    'dataColumn'     => 'data',
    'lifetimeColumn' => 'lifetime'
));
Zend_Session::setSaveHandler( $sh );


## view 初期化
$view = new Zend_View(array('scriptPath' => APP_ROOT.'/view'));

$auth = Zend_Auth::getInstance();
if( !$auth->hasIdentity() ){
    header("Location: /auth.php");
    exit;
}
$view->identity = $auth->getIdentity();

## view render
echo $view->render('auth-ok.php');

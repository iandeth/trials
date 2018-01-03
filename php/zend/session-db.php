<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.session.savehandler.dbtable.html

## table to use
# CREATE TABLE session (
#   id char(32),
#   modified int,
#   lifetime int,
#   data text,
#   PRIMARY KEY (`id`)
# );

$view = new Zend_View(array('scriptPath' => APP_ROOT.'/view'));

## Database config setup
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

## Basic
$s = new Zend_Session_Namespace();
isset($s->viewCount)?
    $s->viewCount++ : $s->viewCount = 1;
$view->viewCount = $s->viewCount;

## view render
echo $view->render('session-db.php');

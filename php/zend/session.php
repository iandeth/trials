<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.session.html
# http://framework.zend.com/manual/en/zend.session.global_session_management.html

## WARNING
# session.auto_start MUST be 0 in php.ini

## if, above can't be accomplished try this
## in .htaccess:
# php_value session.auto_start 0

## to use auto append SID in relative link URLs,
## add these in php.ini (or .htaccess)
# session.use_cookies = Off
# session.use_trans_sid = 1


$view = new Zend_View(array('scriptPath' => APP_ROOT.'/view'));

## Reset Session Data
if( isset($_GET['reset']) ){
    Zend_Session::expireSessionCookie();
    header("Location: $_SERVER[SCRIPT_NAME]");
    exit;
}


## Basic
$s = new Zend_Session_Namespace();  # namespace = 'Default'
isset($s->viewCount)?
    $s->viewCount++ : $s->viewCount = 1;
$view->viewCount = $s->viewCount;


## Another Namespace
$s = new Zend_Session_Namespace('Another');
isset($s->viewCount)?
    $s->viewCount++ : $s->viewCount = 1000;
$view->viewCountAnother = $s->viewCount;


## set expiration timer
$s->setExpirationSeconds(60);
$s->setExpirationSeconds(30, 'viewCount');  # specify key
$s->setExpirationHops(5);                   # next n-times request count


## can lock (read-only)
## but is not persistent over requests.
$s->lock();


## view render
echo $view->render('session.php');

<?php
error_reporting( E_ALL | E_STRICT );

// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
defined('APPLICATION_ENV')
    || define('APPLICATION_ENV', (getenv('APPLICATION_ENV') ? getenv('APPLICATION_ENV') : 'production'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library'),
    realpath(APPLICATION_PATH . '/../../lib-zend-patch'),
    realpath(APPLICATION_PATH . '/../../ZendFramework/library'),
    get_include_path(),
)));

/** Zend_Application */
require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$app = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);
$app->bootstrap();

// mod_rewrite 使わず直接 controller/action を指定する方法
$router = $app->getBootstrap()->getResource('frontcontroller')->getRouter();
$r = new Zend_Controller_Router_Route_Static(
    null,  ## これ重要
    array('controller'=>'trial', 'action'=>'session')
);
$router->addRoute('default', $r);
$app->run();

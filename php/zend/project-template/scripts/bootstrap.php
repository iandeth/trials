<?php
error_reporting( E_ALL | E_STRICT );

// Define path to application directory
defined('APPLICATION_PATH')
    || define('APPLICATION_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
if( !defined('APPLICATION_ENV') )
    require realpath(dirname(__FILE__) . '/_env.php');

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(APPLICATION_PATH . '/../library'),
    get_include_path(),
)));

/** Zend_Application */
require_once 'Zend/Application.php';

// Create application, bootstrap, and run
$application = new Zend_Application(
    APPLICATION_ENV,
    APPLICATION_PATH . '/configs/application.ini'
);
$application->bootstrap();

// バッチの場合は STDOUT にもログ出力
$log = $application->getBootstrap()->getResource('log');
$writer = new Zend_Log_Writer_Stream('php://output');
if (APPLICATION_ENV != "development")
    $writer->addFilter(new Zend_Log_Filter_Priority(Zend_Log::INFO));
$log->addWriter($writer);

return $application;

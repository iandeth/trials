<?php
error_reporting( E_ALL | E_STRICT );

// Define path to application directory
defined('BDCARD_APP_PATH')
    || define('BDCARD_APP_PATH', realpath(dirname(__FILE__) . '/../application'));

// Define application environment
defined('BDCARD_APP_ENV')
    || define('BDCARD_APP_ENV', (getenv('BDCARD_APP_ENV') ? getenv('BDCARD_APP_ENV') : 'testing'));

// Ensure library/ is on include_path
set_include_path(implode(PATH_SEPARATOR, array(
    realpath(BDCARD_APP_PATH . '/../library'),
    get_include_path(),
)));

require_once 'Zend/Loader/Autoloader.php';
Zend_Loader_Autoloader::getInstance();

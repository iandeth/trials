<?php
## because of WP v3.3.1 bug:
## with plugin dir using symlinks -
## wp-content/
##   plugins/
##     myapp/ -> symlink to /foo/bar/myapp
##       myapp.php
## 
## echo plugin_dir_url(__FILE__)
##   bug -> http://.../wp-content/plugins/foo/bar/myapp
##   should be -> http://.../wp-content/plugins/myapp
##
## so manually setting it for now
if (!defined('MYAPP_PLUGIN_URL')) {
    preg_match('/([^\/]+)$/', dirname(__FILE__), $m);
    $dummy_path = WP_PLUGIN_DIR . "/$m[0]/dummy.php";
    define('MYAPP_PLUGIN_URL', plugin_dir_url($dummy_path));
    define('MYAPP_PLUGIN_DIR_PATH', plugin_dir_path($dummy_path));
    unset($m, $dummy_path);
}

## add Zend include path
set_include_path(implode( PATH_SEPARATOR, array(
    MYAPP_PLUGIN_DIR_PATH .'lib',
    MYAPP_PLUGIN_DIR_PATH .'lib-zend/iandeth-patched',
    MYAPP_PLUGIN_DIR_PATH .'lib-zend/official',
    get_include_path()
)));

## initialize Zend Autoloader
require_once 'Zend/Loader/Autoloader.php';
$al = Zend_Loader_Autoloader::getInstance();
$al->registerNamespace('MyApp');

## localize text
Zend_Locale::setDefault('ja_JP');
$loc = new Zend_Locale('ja_JP');
$tr = new Zend_Translate(array(
    'adapter' => 'array',
    'content' => MYAPP_PLUGIN_DIR_PATH .'lib-zend/validate.ja.php',
    'locale'  => $loc
));
Zend_Registry::set('Zend_Locale', $loc);
Zend_Registry::set('Zend_Translate', $tr);


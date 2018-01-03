<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## use lib
define( 'APP_ROOT', realpath( dirname(__FILE__) ) );
set_include_path(implode( PATH_SEPARATOR, array(
    APP_ROOT.'/lib',
    APP_ROOT.'/lib-zend-patch',  # iandeth バグ修正版 Zend クラス達
    APP_ROOT.'/ZendFramework/library',
    get_include_path()
)));

## Zend Autoloader 初期化
require_once 'Zend/Loader/Autoloader.php';
$al = Zend_Loader_Autoloader::getInstance();
$al->setFallbackAutoloader(true);  # Zend 以外の library も自動読み込み

## config 読み込み
return new Zend_Config_Yaml( APP_ROOT.'/config.yml', 'development' );

<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## use lib
define( 'APP_ROOT', realpath( dirname(__FILE__) ) );
set_include_path( APP_ROOT.'/lib' );

## Zend Autoloader 初期化
require_once 'Zend/Loader/Autoloader.php';
Zend_Loader_Autoloader::getInstance();

## config 読み込み
$conf = new Zend_Config_Yaml( APP_ROOT.'/config.yml', 'development' );

## constant が yml 内にあらば置換されてる -> APP_ROOT
echo "foo path is: ", $conf->foo_path, "\n";

## production 設定の一部内容を override
echo "db name is : ", $conf->database->params->dbname, "\n";

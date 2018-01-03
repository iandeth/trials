<?php
/**
 * @package MyApp_Hello
 * @version 1.0
 */
/*
Plugin Name: MyApp Hello
Plugin URI: http://myapp.dyndns.org/wp/
Description: hoge
Author: bashi
Version: 1.0
*/
require_once dirname(__FILE__) . '/bootstrap.php';
$p = new MyApp_Hello();
$p->init();


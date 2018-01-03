<?php
/**
 * @package MyApp_Custom_Type
 * @version 1.0
 */
/*
Plugin Name: MyApp Custom Type
Plugin URI: http://myapp.dyndns.org/wp/
Description: hoge
Author: bashi
Version: 1.0
*/
require_once dirname(__FILE__) . '/bootstrap.php';
if (is_admin()) {
    $p = new MyApp_CT_Admin();
    $p->init();
} else {
    $p = new MyApp_CT_Public();
    $p->init();
}

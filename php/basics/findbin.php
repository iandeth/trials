<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## $FindBin::RealBin
$dir = realpath( dirname(__FILE__) );
echo $dir, "\n";

## use lib "./lib"
set_include_path(implode( PATH_SEPARATOR, array(
    './lib',
    get_include_path()
)));

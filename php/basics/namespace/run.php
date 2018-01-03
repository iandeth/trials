<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## use lib
set_include_path(implode( PATH_SEPARATOR, array(
    './lib',
    get_include_path()
)));

## use Module::Name
require_once 'MyProj/Model/Foo.php';


echo "## 基本\n";
$m = function (){
    $p = new MyProj\Model\Foo();
    echo "say: " . $p->say() . "\n";

    ## クラス内で他クラスのメソッドを呼ぶ
    echo "bar_say: " . $p->bar_say() . "\n";
};
$m();

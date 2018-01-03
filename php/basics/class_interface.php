<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## インターフェースクラス
interface Reader {
    public function read ();
}

interface Writer {
    public function write ($value);
}

## 実装クラス
class Config implements Reader, Writer {

    ## PHP 標準で定義済みなインターフェース
    # http://www.php.net/manual/en/reserved.interfaces.php
    # http://www.php.net/manual/en/spl.interfaces.php

    public function read (){
        return 'read called';
    }

    public function write ($value){
        return "written $value";
    }
}


## main
echo "## 基本\n";
$m = function (){
    $p = new Config();
    echo $p->read() . "\n";
    echo $p->write('foo') . "\n";
};
$m();

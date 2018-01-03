<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/1.11/en/zend.console.getopt.html

$opts = new Zend_Console_Getopt(array(
    'apple|a'    => 'apple option, with no parameter',
    'banana|b=i' => 'banana option, with required integer parameter',
    'pear|p-s'   => 'pear option, with optional string parameter',
    'help|h'     => 'ヘルプを表示',
));
try {
    $opts->parse();
} catch (Zend_Console_Getopt_Exception $e){
    die( $e->getUsageMessage() );
}

## 任意オプションの初期値をセット
## $opts->parse() が内部実行されるので、順番注意
if ($opts->pear === NULL)
    $opts->pear = 'default pear';

## ヘルプの表示
if ($opts->help){
    die( $opts->getUsageMessage() );
}

## 値の取得
echo "banana: ", $opts->banana, "\n";
echo "pear  : ", $opts->pear, "\n";


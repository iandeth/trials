<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

$dir = realpath(dirname(__FILE__));
array_shift( $argv );  # 余分な引数除去

## ヘルプ表示
if( in_array('--help', $argv) || in_array('-h', $argv) ){
    show_help();
    exit;
}

## メイン処理
fwrite(STDOUT, "実行していい？ [y/N]");
$in = trim(fgets(STDIN));
if( !preg_match('/^y/i', $in) ){
    echo "キャンセルしました\n";
    exit;
}
echo "実行しました\n";


## utils
function show_help (){
    echo <<<EOS

## ほげほげツール

usage:

  /path/to/php script.php [-h|--help]

options:

  -h, --help
    このヘルプを表示。


EOS;
}

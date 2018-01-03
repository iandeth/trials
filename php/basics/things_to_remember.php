<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );


echo "## 三項演算子は perl と逆の左結合\n";
# ネストさせる際はきちんとカッコを使うべし
$m = function (){
    $f1 = true;
    $f2 = false;
    $r = $f1 ? 1 : $f2 ? 2 : 0;
    echo $r . "\n";
    # -> 2 
    # 結合状態 = ( $f1 ? 1 : $f2 ) ? 2 : 0

    # なので正しく書くにはカッコで
    $r = $f1 ? 1 : ( $f2 ? 2 : 0 );
    echo $r . "\n";
};
$m();


echo "\n## エラー制御演算子\n";
# 未定義の hash key 参照は Notice になる。これを防ぐのが @
$m = function (){
    # echo $_get['foo'];  # これだと Notice
    echo @$_get['foo'];   # '@' を付けるとセーフ
};
$m();


echo "\n## ループ中の変数参照\n";
$m = function (){
    $h = array(
        'apple'  => 'red',
        'banana' => 'yellow',
        'orange' => 'orange',
    );
    # & 付きのループ変数は実値の操作になる
    foreach ( $h as &$v ){
        $v = 'black';
    }
    foreach ( $h as $k => $v ){
        echo "$k: $h[$k]\n";
    }
};
$m();


echo "\n## switch 文\n";
$m = function (){
    # 各 case 毎に break 必須
    $v = 6;
    switch ( $v ){
        case 3:
            echo "深夜3時です\n";
            break;
        case 6:
            echo "朝の6時です\n";
            break;
        default:
            echo "何時？\n";
            break;
    }
};
$m();


echo "\n## stdClass と object キャスト\n";
$m = function (){
    $p = new stdClass();  # php の標準クラス
    $p->some_prop = 'foo';
    echo "some prop: " . $p->some_prop . "\n";

    ## スカラー値を object キャストすると scalar prop になる
    $var = 'bar';
    $p = (object)$var;
    echo "object scalar: " . $p->scalar . "\n";

    ## array 値を object キャストするとそのまま prop 名になる
    $var = array( 'foo'=>2 );
    $p = (object)$var;
    echo "object array: " . $p->foo . "\n";
};
$m();


echo "\n## debug\n";
$m = function (){
    ## write to php|httpd error log
    error_log( "なんか変よ" );

    ## warn
    trigger_error( "これも変よ", E_USER_WARNING );

    ## die
    # trigger_error( "それは駄目だ", E_USER_ERROR );

    ## Data::Dumper
    $a = array( 1, 2, 3 );
    print_r( $a );
};
$m();

echo "\n## 現在日時\n";
echo date("Y-m-d H:i:s"), "\n";

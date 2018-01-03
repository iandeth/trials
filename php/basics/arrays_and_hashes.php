<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );


echo "## 配列\n";
$m = function (){
    # 基本
    $a = array( 'apple', 'banana', 'orange' );
    echo "$a[2]\n";  # orange

    # push
    $a[] = 'pinapple';
    echo join( ", ", $a ), "\n";

    # 存在しない要素の参照は Notice
    # echo $a[5], "\n";  # Notice
    echo @$a[5], "\n";   # セーフ

    # perl でいう defined()
    # これだと Notice を吐かない
    echo ( isset( $a[5] ) ? $a[5] : 'a[5] undefined' ) . "\n";

    # perl でいう exists()
    # これも Notice を吐かない
    echo ( array_key_exists( 5, $a ) ? $a[5] : 'a[5] not exist' ) . "\n";

    # ループ処理
    foreach ( $a as $v ){
        echo "$v\n";
    }
    foreach ( $a as $i => $v ){
        echo "$i : $v\n";
    }
    echo "$i => ループ用変数は残る\n";
};
$m();


echo "\n## 連想配列\n";
$m = function (){
    # 基本
    $h = array(
        'apple'  => 'red',
        'banana' => 'yellow',
        'orange' => 'orange',
    );
    echo $h['banana'], "\n";
    echo "$h[banana]\n";  # "" の中に入れるなら single quotation ハズす

    # 存在しない要素の参照は Notice
    # echo $h['pinapple'], "\n";  # Notice
    echo @$h['pinapple'], "\n";   # セーフ

    # perl でいう defined()
    # これだと Notice を吐かない
    echo ( isset( $h['pinapple'] ) ? $h['pinapple'] : 'h[pinapple] undefined' ) . "\n";

    # perl でいう exists()
    # これも Notice を吐かない
    echo ( array_key_exists( 'pinapple', $h ) ? $h['pinapple'] : 'h[pinapple] not exist' ) . "\n";

    # ループ処理
    foreach ( $h as $v ){
        echo "$v\n";
    }
    foreach ( $h as $k => $v ){
        echo "$k : $v\n";
    }
};
$m();


echo "\n## 配列と連想配列の混在\n";
$m = function (){
    $h = array(
        'apple',
        'banana' => 'yellow',
        'orange',
    );
    echo $h[0], "\n";   # => apple
    echo $h[1], "\n";   # => banana と思いきや orange
    echo @$h[2], "\n";  # => 未定義 (Notice)
    echo $h['banana'], "\n";  # => yellow

    foreach ( $h as $v ){
        echo "$v\n";
    }
    # => apple, yellow, orange
    
    foreach ( $h as $k => $v ){
        echo "$k : $v\n";
    }
    # =>
    # 0 : apple
    # banana : yellow
    # 1 : orange
};
$m();


echo "\n## 構造体\n";
$m = function (){
    $h = array(
        'apple' => array(
            'price' => 80,
            'count' => 2,
        ),
        'banana' => array(
            'hawaii', 'guam',
        ),
    );

    echo "apple price is: " . $h['apple']['price'] . "\n";
    echo "banana made in: " . $h['banana'][1] . "\n";
};
$m();

echo "\n";

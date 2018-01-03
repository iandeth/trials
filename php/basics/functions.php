<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );


echo "## 初期値つき引数\n";
$m = function (){
    function hello ( $name, $msg = 'hello!' ){
        echo "$name $msg\n";
    }
    hello( 'バシ' );
};
$m();


echo "\n## 引数の型指定\n";
$m = function (){
    function comma ( array $arr ){
        echo join( ", ", $arr ), "\n";
    }
    $a = array( 1, 2 );
    comma( $a );
    # comma( 1 );  # これ Catchable Fatal Error になる 
};
$m();


echo "\n## 参照渡し\n";
$m = function (){
    function add_exclamation ( &$arr ){
        foreach( $arr as &$v )
            $v .= '!';
    }
    $a = array( 1, 'two', 3 );
    add_exclamation( $a );
    # add_exclamation( 1 );  # これ Fatal error
    echo join( ", ", $a ) . "\n";

    ## こっちの書き方でも OK
    function add_exclamation2 ( $arr ){
        foreach( $arr as &$v )
            $v .= '!';
    }
    $a = array( 1, 2, 'three' );
    add_exclamation2( &$a );   # <- 渡す際に参照形で
    echo join( ", ", $a ) . "\n";
};
$m();


echo "\n## Object 参照返し\n";
$m = function (){
    function &ret_two ( &$arr ){   # メソッド名頭に & つけると参照返し
        return $arr[1];
    }
    $a = array( 1, 'two', 3 );
    $v =& ret_two( $a );   # =& で参照受け取り。これも必要
    $v = 'TWO';            # これで $a[1] も変わる
    echo "b: $v\n";
    echo "a: " . join( ", ", $a ) . "\n";
};
$m();


echo "\n## call_user_func\n";
$m = function (){
    function bark ( $s1, $s2 ){
        echo "barking $s1 $s2\n";
    }
    call_user_func( 'bark', 'wee', 'doo' );

    ## 引数 array object 渡し
    call_user_func_array( 'bark', array('bee', 'boo') );

    class Dog {
        static function bark ( $s1, $s2 ){
            echo "bow wow $s1 $s2\n";
        }
        function walk ( $s1, $s2 ){
            echo "dog walking $s1 $s2\n";
        }
    }
    ## クラスメソッド
    call_user_func( 'Dog::bark', 'wee', 'doo' );
    call_user_func( array('Dog', 'bark'), 'wee', 'doo' );

    ## インスタンスメソッド
    $d = new Dog();
    call_user_func( array($d, 'walk'), 'goo', 'gee' );
};
$m();


echo "\n## クロージャ\n";
$m = function (){
    $pow = function ( $times=2 ){
        $msg = "乗算するよ";
        ## use を使って閉じ込めたい変数を指定
        return function ( $v=1 ) use( &$times, $msg ) {
            echo "$msg\n";
            return pow( $v, $times );
        };
    };
    $func = $pow(3);
    echo "2の三乗: " . $func(2), "\n";
};
$m();


echo "\n## PHP 関数の戻り値は array でも deep copy された別 array になる\n";
$m = function (){
    function c1 ( $arr ){
        $arr[1] = 'changed';
        return $arr;
    }

    $d1 = array( 'a', 'b', 'c' );
    $d2 = array( 1, 2, $d1 );
    $e  = c1( $d2 );
    $e[2][0] = 'x';
    echo "\$e の中身:\n";
    print_r( $e );
    echo "\$d2 の中身 (まるで変換してない):\n";
    print_r( $d2 );
};
$m();

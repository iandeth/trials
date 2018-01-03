<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

echo "## 基本\n";
$m = function (){
    ## 例外を投げる関数
    function div ($v1,$v2){
        if( $v2 === 0 )
            throw new Exception( "arg #2 is zero" );
        return $v1/$v2;
    }

    ## main 処理
    try {
        echo div( 1, 2 ), "\n";
        echo div( 1, 0 ), "\n";
    } catch (Exception $e){
        echo 'エラー: ', $e->getMessage(), "\n";
    }

    ## SPL 標準例外クラス
    # http://php.net/manual/en/spl.exceptions.php
    # http://www.php.net/~helly/php/ext/spl/classException.html
};
$m();

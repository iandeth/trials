<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## 抽象クラス
abstract class Animal {

    public $voice;

    ## コンストラクタ
    public function __construct ( $legs=2 ){
        $this->legs = $legs;
    }

    ## 抽象メソッド
    abstract public function bark ();
    abstract public function fur ( $type='fluff' );
}

## 継承クラス
class Dog extends Animal {

    public $voice = 'bow wow';

    public function bark (){
        return $this->voice;
    }

    ## 引数定義を守りつつ、更に追加
    public function fur ( $type='fluff', $color='brown' ){
        return "fur is $type and $color";
    }
}


## main
echo "## 基本\n";
$m = function (){
    $a = new Dog(4);
    echo "bark: " . $a->bark() . "\n";
    echo "fur: " . $a->fur( 'wet', 'red' ) . "\n";
};
$m();

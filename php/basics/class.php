<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## 親クラス
class Animal {

    ## クラス定数
    const SIZE = 'medium';  # 注意: array 等は使えない

    ## クラス変数
    public static $tail = 'long';

    ## クラスメソッド
    public static function getTail (){
        return self::$tail;
    }

    ## インスタンス変数
    public $voice = 'ani ani';
    public $legs;
    # private   ... 
    # protected ...

    ## コンストラクタ
    public function __construct ( $legs=2 ){
        $this->legs = $legs;
    }

    ## インスタンスメソッド
    public function bark (){
        return $this->voice;
    }
    # private function ...
    # protected function ...

    ## インスタンスメソッドからクラス変数を参照
    public function myTail (){
        return static::$tail;   # self では無く。遅延静的束縛
    }

    ## 継承クラスで override 不可 => final
    public final function bla (){
        return 'bla';
    }

    ## Reflection (マジックメソッド): 文字列変換
    ## http://jp2.php.net/manual/en/book.reflection.php
    public function __toString (){
        return 'This is class ' . __CLASS__;
    }
}

## 継承クラス
class Dog extends Animal {

    public $voice = 'bow wow';
    public static $tail = 'dog short';

    ## コンストラクタ
    public function __construct ( $legs=4 ){
        parent::__construct( $legs );
    }

    ## method override
    public function bark (){
        return $this->voice . " wee";
    }

    ## 親クラスのクラス定数・定数を参照
    public function animalSize (){
        return parent::SIZE . " / " . parent::$tail;
    }
}


## accessor override 試すクラス
class Bird {
    ## private じゃないと __get|__set 呼ばれない！
    private $voice = 'peeee';

    public function __get ($key){
        echo "__get: $key\n";
        if( property_exists($this, $key) )
            return $this->$key;
    }

    public function __set ($key, $value){
        echo "__set: $key\n";
        if( property_exists($this, $key) )
            $this->$key = $value;
        return $this;
    }
}


## main
echo "## 基本\n";
$m = function (){
    $a = new Animal();
    echo "bark: " . $a->bark() . "\n";

    ## property set
    $a->voice = 'foo';
    echo "bark: " . $a->bark() . "\n";  # foo

    ## 未宣言の property も動的生成 (like perl)
    $a->foo = '123';
    echo "dynamic prop: " . $a->foo . "\n";

    ## クラス定数
    echo "size: " . Animal::SIZE . "\n";

    ## クラス変数
    echo "tail: " . Animal::$tail . "\n";

    ## クラス変数も動的変更可能
    Animal::$tail = 'fluff';
    echo "tail: " . Animal::$tail . "\n";  # fluff 
    Animal::$tail = 'long';   # 元に戻しとく

    ## クラスメソッド
    echo "getTail: " . Animal::getTail() . "\n";

    ## インスタンスメソッドからクラス変数を参照
    echo 'self::tail - ' . $a->myTail() . "\n";

    ## Reflection: 自動文字列変換
    echo "__toString(): $a\n";
};
$m();


echo "\n## 継承\n";
$m = function (){
    $a = new Dog();
    echo "legs: " . $a->legs . "\n";
    echo "bark: " . $a->bark() . "\n";

    ## 親クラスのクラス定数・定数を参照
    echo "animal size: " . $a->animalSize() . "\n";
};
$m();


echo "\n## 変数が特定クラスのインスタンスかどうかを確認\n";
$m = function (){

    ## クラス関連の関数:
    ## http://www.php.net/manual/en/ref.classobj.php

    $p = new Dog();
    ## クラス名を取得
    echo 'class is: ' . get_class( $p ) . "\n";
    ## クラス判定
    if( $p instanceof Dog === true ){
        echo '$p is Dog' . "\n";
    }
};
$m();


echo "\n## static\n";
$m = function (){
    $a = new Dog();
    echo "tail: " . $a->myTail() . "\n";
};
$m();


echo "\n## accessor override\n";
$m = function (){
    $a = new Bird();
    $a->voice = 'wufeeee';
    echo "voice: " . $a->voice . "\n";
};
$m();

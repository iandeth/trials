<?php

namespace MyProj\Model;

## 他のモジュールを読み込む
require_once 'MyProj/Bar.php';

## こう書けば MyProj\Bar を Bar として利用可能
## use MyProj\Bar as Bar と書いても OK
use MyProj\Bar;

class Foo {
    public function say (){
        return __CLASS__ . ' say called';
    }

    public function bar_say (){
        $p = new Bar();            # use があるから
        # $p = new \MyProj\Bar();  # use 無かったらこう
        return $p->say();

        # use 
    }
}

<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.filter.html
# http://framework.zend.com/manual/en/zend.filter.set.html

Zend_Registry::set('Zend_Locale', new Zend_Locale('ja_JP'));
Zend_Locale::setDefault('ja_JP');


echo "## 基本\n";
$m = function (){
    $f = new Zend_Filter_Alnum();
    $s = $f->filter('This is (my) content あいう: 123');
    echo "$s\n";

    ## static 呼び出し
    $s = Zend_Filter::filterStatic("<b>o'reilly</b>", 'HtmlEntities',
            array('quotestyle'=>ENT_QUOTES) );
    echo "$s\n";
};
$m();


echo "\n## 複数フィルタ\n";
$m = function (){
    $fc = new Zend_Filter();
    $fc->addFilter(new Zend_Filter_Alpha())
       ->addFilter(new Zend_Filter_StringToLower());
    $s = $fc->filter( 'ABC あいう de!' );
    echo "$s\n";
};
$m();


echo "\n## 自作フィルタ\n";
$m = function (){
    $f = new Filter_StringToAsterisc();
    $s = $f->filter('foobar');
    echo "$s\n";
};
$m();

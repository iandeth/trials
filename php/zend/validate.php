<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.validate.set.html


## まずは Locale 設定すべし:
## 1. Zend FW 標準の指定方法
$loc = new Zend_Locale('ja_JP');
Zend_Registry::set('Zend_Locale', $loc);
## 2. でも module によって上記を無視する場合があるので
## こっちのブラウザ毎判定で NG な場合の fallback 指定もしておくべし
## http://framework.zend.com/issues/browse/ZF-11631
Zend_Locale::setDefault('ja_JP');


## エラーメッセージの日本語化
## 1. 日本語固定
$tr = new Zend_Translate(array(
    'adapter' => 'array',
    'content' => APP_ROOT.'/ZendFramework/resources/languages/ja/Zend_Validate.php',
    'locale'  => $loc
));
## 2. 多言語対応
#$tr = new Zend_Translate(array(
#    'adapter' => 'array',
#    'locale'  => $loc,
#    'content' => APP_ROOT.'/translate/languages',
#    'scan'    => Zend_Translate::LOCALE_DIRECTORY
#));

## 3. さらに一部カスタマイズ
#$tr->addTranslation(array(
#    'content' => array(
#        Zend_Validate_StringLength::TOO_SHORT => "ちょい短いわ '%value%'",
#        Zend_Validate_StringLength::TOO_LONG  => "ちょい長いわ '%value%'"
#    ),
#    'locale'  => 'ja'
#));
# 最後の addTranslation が 'de' とかだと現在 locale も
# 変わっちまうバグの為、現在 locale を再指定
#$tr->setLocale('ja_JP');

## 4. 最後に registry 登録しておく
Zend_Registry::set('Zend_Translate', $tr);


echo "\n## 基本\n";
$m = function (){
    $va = new Zend_Validate_StringLength(array('min'=>8, 'max'=>12));
    if ( !$va->isValid( '22' ) )
        print_r( $va->getMessages() );
};
$m();


echo "\n## Date は locale 指定しなくても日本語 OK\n";
$m = function (){
    $va = new Zend_Validate_Date(array('format' => 'yyyy MMMM'));
    # $va = new Zend_Validate_Date(array('format'=>'yyyy MMMM', 'locale'=>'ja'));
    if ( !$va->isValid('2010 6月') )
        print_r( $va->getMessages() );
};
$m();


echo "\n## StringLength は日本語の場合 encoding 指定必須\n";
$m = function (){
    $va = new Zend_Validate_StringLength(array('min'=>3, 'max'=>6, 'encoding'=>'UTF-8'));
    if ( !$va->isValid('あい') )
        print_r( $va->getMessages() );
};
$m();


echo "\n## Alnum でひらがなが valid になっちまう？\n";
$m = function (){
    $va = new Zend_Validate_Alnum();
    echo "-> Zend_Locale::setDefault('ja') しておけば OK\n";
    if ( !$va->isValid('あい') )
        print_r( $va->getMessages() );
    else
        echo "is valid\n";
};
$m();


echo "\n## 複数の validation を設定\n";
$m = function (){
    $vc = new Zend_Validate();
    $vc->addValidator(
        new Zend_Validate_StringLength(array('min'=>3, 'max'=>6, 'encoding'=>'UTF-8'))
    )->addValidator(
        new Zend_Validate_Regex(array('pattern' => '/^あ/'))
    );
     
    $v = 'い';
    if ( !$vc->isValid($v) ){
        foreach ($vc->getMessages() as $m)
            echo "e: $m\n";
    }
};
$m();


echo "\n## 自作 validate module\n";
$m = function (){
    $va = new Validate_PasswordStrength(array('length' => 4));
    if ( !$va->isValid('fe') )
        print_r( $va->getMessages() );
};
$m();

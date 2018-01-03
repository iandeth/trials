<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.filter.input.html


echo "## 基本\n";
$m = function (){
    $v = array(
        'username' => array(
            'presence' => 'required'
        ),
        'nickname' => array(
            'presence' => 'required',
            'default'  => 'bobby',
            'alnum',
            array('regex', '/^[a-z]/i')
        ),
        'password' => array(
            array( 'stringLength', 6 ),
            'presence' => 'required'
        )
    );
    $f = array(
        'nickname' => array(
            'stringToLower'
        )
    );
    $fi = new Zend_Filter_Input($f, $v);

    ## エラー系
    $d = array(
        'username' => null,
        'nickname' => 'あ!',
        'password' => '12345'
    );
    $fi->setData( $d );
    if(!$fi->isValid())
        print_r( $fi->getMessages() );
    else
        echo "data is valid\n";

    ## 正常系
    $d = array(
        'username' => 'あいう<',
        'nickname' => 'ABC',
        'password' => '1234567'
    );
    $fi->setData( $d );
    if(!$fi->isValid())
        echo "data is invalid\n";
    else
        print_r( $fi->getUnescaped() );
        # or for html displaying:
        # print_r( $fi->getEscaped() );
};
$m();

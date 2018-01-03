<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/1.11/en/zend.mail.html 

## 利用するメールアドレス
$from = '';
$to   = '';

echo "## 基本\n";
$m = function () use($from, $to){
    $zm = new Zend_Mail_Jp();
    $zm->setBodyText("メール本文です\nこんにちは")
       ->setFrom($from, '送信者')
       ->setReplyTo($from, '送信者 リプライ')
       ->addTo($to, '宛名')
       ->addCc($to, 'Cc 宛名')
       ->setSubject('テスト送信 - 基本 JP')
       ->send();
};
$m();


echo "## HTML メール\n";
$m = function () use($from, $to){
    $body = '<h1>メール本文です</h1><br/><a href="https://encrypted.google.com/">' .
        '<img src="https://encrypted.google.com/images/logos/ssl_logo.png"/></a>';
    $zm = new Zend_Mail_Jp();
    $zm->setBodyHtml($body)
       ->setFrom($from, '送信者')
       ->addTo($to, '宛名')
       ->setSubject('テスト送信 - HTML JP')
       ->send();
};
$m();


echo "## 外部 SMTP (eg. gmail) 利用\n";
$m = function () use($from, $to){
    $zm = new Zend_Mail_Jp();
    $zmtp = new Zend_Mail_Transport_Smtp('smtp.gmail.com', array(
        'ssl' => 'ssl',
        'auth' => 'login',
        'username' => 'username@gmail.com',
        'password' => 'xxx',
    ));
    $zm->setBodyText("メール本文です\nこんにちは")
       ->setFrom($from, '送信者')
       ->setReplyTo($from, '送信者 リプライ')
       ->addTo($to, '宛名')
       ->addCc($to, 'Cc 宛名')
       ->setSubject('テスト送信 - 基本 JP')
       ->send($zmtp);
};
$m();

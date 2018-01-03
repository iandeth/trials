<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/1.11/en/zend.mail.html 

## 利用するメールアドレス
$from = '';
$to   = '';

## 文字コード変換
function cv ($str, $mime_enc=0){
    $ret = mb_convert_encoding($str, 'ISO-2022-JP', 'UTF-8');
    if (!$mime_enc)
        return $ret;
    ## From, ReplyTo, To で日本語使うときにはこの変換も必要
    return mb_encode_mimeheader($ret, 'ISO-2022-JP');
}


echo "## 基本\n";
$m = function () use($from, $to){
    $zm = new Zend_Mail('ISO-2022-JP');
    $zm->setBodyText(cv("メール本文です\nこんにちは"), null, Zend_Mime::ENCODING_7BIT)
       ->setFrom($from, cv('送信者', 1))
       ->setReplyTo($from, cv('送信者 リプライ', 1))
       ->addTo($to, cv('宛名', 1))
       ->addCc($to, cv('Cc 宛名', 1))
       ->setSubject(cv('テスト送信 - 基本', 1))
       ->setHeaderEncoding(Zend_Mime::ENCODING_BASE64)
       ->send();
};
$m();


echo "## HTML メール\n";
$m = function () use($from, $to){
    $body = '<h1>メール本文です</h1><br/><a href="https://encrypted.google.com/">' .
        '<img src="https://encrypted.google.com/images/logos/ssl_logo.png"/></a>';
    $zm = new Zend_Mail('ISO-2022-JP');
    $zm->setBodyHtml(cv($body), null, Zend_Mime::ENCODING_7BIT)
       ->setFrom($from, cv('送信者', 1))
       ->addTo($to, cv('宛名', 1))
       ->setSubject(cv('テスト送信 - HTML', 1))
       ->setHeaderEncoding(Zend_Mime::ENCODING_BASE64)
       ->send();
};
$m();

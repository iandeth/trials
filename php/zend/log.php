<?php
require_once 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.log.html

/*
EMERG   = 0;  # Emergency: system is unusable
ALERT   = 1;  # Alert: action must be taken immediately
CRIT    = 2;  # Critical: critical conditions
ERR     = 3;  # Error: error conditions
WARN    = 4;  # Warning: warning conditions
NOTICE  = 5;  # Notice: normal but significant condition
INFO    = 6;  # Informational: informational messages
DEBUG   = 7;  # Debug: debug messages
*/

echo "## 基本\n";
$m = function (){
    $out = 'php://output';
    #$out = realpath(dirname(__FILE__)) . '/log.txt';
    $log = new Zend_Log( new Zend_Log_Writer_Stream($out) );
    $log->log('インフォです', Zend_Log::INFO);
    $log->info('インフォです short');
};
$m();


# echo "## メール\n";
# $m = function (){
#     $to   = 'iandeth@gmail.com';
#     $mail = new Zend_Mail();
#     $mail->setFrom('iandeth@gmail.com')->addTo($to);
#     $writer = new Zend_Log_Writer_Mail($mail);
#     $writer->setSubjectPrependText('ログをメールで飛ばすテスト');
#     $log = new Zend_Log();
#     $log->addWriter($writer);
#     $log->warn('ワーニングだよ');
#     $log->err('エラーだよ');
# };
# $m();


echo "## レベルフィルタ\n";
$m = function (){
    $out = 'php://output';
    $log = new Zend_Log( new Zend_Log_Writer_Stream($out) );
    $log->addFilter( new Zend_Log_Filter_Priority(Zend_Log::ERR) );
    $log->info('インフォです');
    $log->err('エラーです');
};
$m();

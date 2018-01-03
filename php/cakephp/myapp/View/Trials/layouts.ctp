<?php 
    ## タイトル指定
    $this->set('title_for_layout', 'カスタムタイトル');
    ## JS 読み込み
    $this->Html->script(array('jquery','main'), array('inline'=>false));
    $this->Html->script(array('hoge'), array('inline'=>false));
    ## CSS 読み込み
    $this->Html->css(array('style','blog'), null, array('inline'=>false));
?>

実際のコンテンツ

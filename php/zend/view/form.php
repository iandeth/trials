<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>form</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
    .errors   { color:#DD0000 }
    pre.debug { margin-top:50px; padding:10px; background:#EEE; font-size:0.9em; }
    </style>
</head>
<body>
<?= $this->partial( 'partial/hello.php', array('name'=>'あいう') ) ?>
<?php if (array_keys($_POST) && $this->form->isValid($_POST)): ?>
    <?php $this->fvals = $this->form->getValues() ?>
    <h2>完了</h2>
    <dl>
        <dt>ユーザー名</dt>
        <dd><?= $this->escape( $this->fvals['username'] ) ?></dd>
        <dt>ニックネーム</dt>
        <dd><?= $this->escape( $this->fvals['nickname'] ) ?></dd>
        <dt>パスワード</dt>
        <dd><?php
            array_map( function(){ echo '*'; }, str_split( $this->fvals['password'] ) );
        ?></dd>
        <dt>性別</dt>
        <dd><?= $this->form->getElement('gender')->getMultiOption( $this->fvals['gender'] ) ?></dd>
    </dl>
<?php else: ?>
    <?= $this->form ?>
    <pre class="debug"><? print_r( $this->form->getMessages() ) ?></pre>
<?php endif ?>
</body>
</html>

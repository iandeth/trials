<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>form manually</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
    .errors   { color:#DD0000 }
    pre.debug { margin-top:50px; padding:10px; background:#EEE; font-size:0.9em; }
    </style>
</head>
<body>
<ul>
<?php if( $this->form->isErrors() ): ?>
    <?php foreach( $this->form->getMessages() as $k=>$msgs ): ?>
        <?php $label = $this->form->getElement($k)->getLabel() ?>
        <?php foreach( $msgs as $m ): ?>
        <li class="errors"><?= "[$label] " . $this->escape($m) ?></li>
        <?php endforeach ?>
    <?php endforeach ?>
<?php endif ?>
</ul>
<form action="" method="post">
<dl>
    <dt>ユーザー名</dt>
    <dd><?= $this->formText('username', $this->fvals['username']) ?></dd>
    <dt>パスワード</dt>
    <dd><?= $this->formPassword('password', $this->fvals['password']) ?></dd>
    <dt>性別</dt>
    <dd><?= $this->formRadio('gender', $this->fvals['gender'], null, array('M'=>'男', 'F'=>'女'), '&nbsp;&nbsp;') ?></dd>
    <dt>年齢</dt>
    <dd><?= $this->formMultiCheckbox('age', $this->fvals['age'], null, array(
        '10'=>'10代', '20'=>'20代', '30'=>'30代', '40'=>'40代'
    ), '&nbsp;&nbsp;') ?><br/>
    <?= $this->formMultiCheckbox('age', $this->fvals['age'], null, array(
        '50'=>'50代', '60'=>'60代'
    ), '&nbsp;&nbsp;') ?></dd>
    <dt>&nbsp;</dt>
    <dd><input type="submit" value="送信"></dd>
</dl>
</form>
<pre class="debug">
## form errors
<? var_dump( $this->form->getMessages() ) ?>

## form values
<? var_dump( $this->fvals ) ?>
<? var_dump( $this->form->getErrorMessages() ) ?>
</pre>
</body>
</html>

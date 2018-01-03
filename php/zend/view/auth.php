<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>auth</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
    .errors   { color:#DD0000 }
    dt        { margin-bottom:10px; }
    dd        { margin-bottom:20px; }
    pre.debug { margin-top:50px; padding:10px; background:#EEE; font-size:0.9em; }
    </style>
</head>
<body>
<h1>auth</h1>
<?php if( $this->auth_res && !$this->auth_res->isValid() ): ?>
    <p class="errors"><?php
        switch ($this->auth_res->getCode()){
            case -1:
                echo 'ユーザーが存在しません';
                break;
            case -3:
                echo 'パスワードが正しくありません';
                break;
            default:
                echo 'ユーザー・パスワードが正しくありません';
                break;
        }
    ?></p>
<?php endif ?>
<?= $this->form ?>
<pre class="debug">
<?php
    var_dump( $this->errors );
    var_dump( $this->auth_res );
?>
</pre>
</body>
</html>

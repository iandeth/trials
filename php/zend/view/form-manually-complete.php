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
<h2>完了</h2>
<dl>
    <dt>ユーザー名</dt>
    <dd><?= $this->escape( $this->fvals['username'] ) ?></dd>
    <dt>パスワード</dt>
    <dd><?php
        if( $this->fvals['password'] )
            array_map( function(){ echo '*'; }, str_split( $this->fvals['password'] ) );
        else
            echo 'なし';
    ?></dd>
    <dt>性別</dt>
    <dd><?= $this->form->getElement('gender')->getMultiOption( $this->fvals['gender'] ) ?></dd>
    <dt>年代</dt>
    <dd><?php
        $_f = $this->form;
        $arr = array_map( function($v) use($_f){
            return $_f->getElement('age')->getMultiOption($v);
        }, $this->fvals['age'] );
        echo implode('、', $arr);
    ?></dd>
</dl>
<pre class="debug">
## form values
<? var_dump( $this->fvals ) ?>
</pre>
</body>
</html>

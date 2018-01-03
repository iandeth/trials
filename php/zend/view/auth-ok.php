<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>auth ok</title>
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
ようこそ <?= $this->escape($this->identity) ?> さん
<pre class="debug">
<?php
    var_dump( $this->identity );
    var_dump( $_SESSION );
?>
</pre>
</body>
</html>

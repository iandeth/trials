<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>session</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <style type="text/css">
    .errors   { color:#DD0000 }
    dt        { margin-bottom:10px; }
    dd        { margin-bottom:20px; }
    pre.debug { margin-top:50px; padding:10px; background:#EEE; font-size:0.9em; }
    </style>
</head>
<body>
<h1>session</h1>
<dl>
    <dt>view count</dt>
    <dd><?= $this->escape($this->viewCount) ?></dd>
    <dt>view count (another namespace)</dt>
    <dd><?= $this->escape($this->viewCountAnother) ?></dd>
    <dt>SID get param in relative urls (will not work if session.use_cookies = 1)</dt>
    <dd><a href="foo.html">foo link</a></dd>
    <dt>reset session (eg: logout)</dt>
    <dd><a href="?reset=1">reset</a></dd>
</dl>
<pre class="debug">
<?php if( isset($_SESSION) )
    var_dump( $_SESSION );
?>
</pre>
</body>
</html>

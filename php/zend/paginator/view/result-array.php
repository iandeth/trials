<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>paginator array</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<h1>ページング via Array</h1>
<?= $this->paginationControl($this->pager, 'Sliding', 'total.phtml') ?>
<ul>
<?php foreach($this->pager as $item): ?>
  <li><?= $this->escape($item) ?></li>
<?php endforeach; ?>
</ul>
<div>
<?php
## style は上の初回 total.phtml 処理時に固定化されるので２回目以降は効果なし
?>
<?= $this->paginationControl($this->pager, 'Sliding', 'search-pagination.phtml') ?>
<?#= $this->paginationControl($this->pager, 'Sliding', 'item-pagination.phtml') ?>
<?#= $this->paginationControl($this->pager, 'All', 'dropdown-pagination.phtml') ?>
</div>
</body>
</html>

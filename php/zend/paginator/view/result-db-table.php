<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>paginator DB_Table</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>
<body>
<h1>ページング via DB_Table</h1>
<?= $this->paginationControl($this->pager, 'Sliding', 'total.phtml') ?>
<ul>
<?php foreach($this->pager as $row): ?>
  <li><?= $this->escape($row->text) ?></li>
<?php endforeach; ?>
</ul>
<div>
<?= $this->paginationControl($this->pager, 'Sliding', 'search-pagination.phtml') ?>
</div>
</body>
</html>

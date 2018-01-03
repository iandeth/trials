<?php
$conf = require dirname(__FILE__).'/../bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.paginator.usage.html

$data = array();
for($i=1; $i<=200; $i++)
    $data[] = "データ$i";

$view = new Zend_View(array('scriptPath' => APP_ROOT.'/paginator/view'));
$pager = Zend_Paginator::factory($data);
$pager->setPageRange(5);
$pager->setItemCountPerPage(10);
if( isset($_GET['page']) )
    $pager->setCurrentPageNumber( intval($_GET['page']) );
$view->pager = $pager;
echo $view->render('result-array.php');

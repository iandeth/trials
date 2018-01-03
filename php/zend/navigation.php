<?php
require_once 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.navigation.html

## サンプル
$nav = new Zend_Navigation(array(
  array(
    'label' => 'Page 1',
    'uri'   => 'page-1',
    'foo'   => 'bar',
    'pages' => array(
      array(
        'label' => 'Page 1.1',
        'uri'   => 'page-1.1',
        'foo'   => 'bar',
      ),
      array(
        'label' => 'Page 1.2',
        'uri'   => 'page-1.2',
        'class' => 'my-class',
        'pages' => array(
           array(
             'label' => 'Page 1.2.1 だよ',
             'uri'   => 'page-1.2.1',
           ),
        )
      ),
      array(
        'type'   => 'uri',
        'label'  => 'Page 1.3',
        'uri'    => 'page-1.3',
        'action' => 'about'
      )
    )
  ),
  array(
    'label'      => 'Page 2',
    'id'         => 'page_2_and_3',
    'class'      => 'my-class',
    'module'     => 'page2',
    'controller' => 'index',
    'action'     => 'page1'
  ),
  array(
    'label'      => 'Page 3',
    'id'         => 'page_2_and_3',
    'module'     => 'page3',
    'controller' => 'index'
  )
));


echo "## 親ノード取得\n";
$m = function () use($nav) {
    ## 最下層ノードが見つかった場合
    $p = $nav->findBy('uri', 'page-1.2.1');
    ## 親ノードの階層を全部取得
    $tree = array($p);
    while( $page = $p->parent ){
        if( !is_a($page, 'Zend_Navigation_Page') )
            break;  # root node は Zend_Navigation_Container なので
        array_unshift( $tree, $page );
        $p = $page;
    }
    ## 最後に breadcrumb を生成
    $labels = array();
    foreach( $tree as $page )
        array_push( $labels, $page->label );
    echo implode(' > ', $labels), "\n";
};
$m();


echo "## 再帰ループ処理\n";
$m = function () use($nav){
    $it = new RecursiveIteratorIterator(
            $nav, RecursiveIteratorIterator::SELF_FIRST);
    foreach ($it as $page)
        echo $page->label, "\n";
};
$m();


echo "## config 定義\n";
$m = function (){
    $conf = new Zend_Config_Yaml( APP_ROOT.'/navigation.yml', 'nav' );
    $nav = new Zend_Navigation($conf);
    $it = new RecursiveIteratorIterator(
            $nav, RecursiveIteratorIterator::SELF_FIRST);
    foreach ($it as $page)
        echo $page->label, "\n";
};
$m();

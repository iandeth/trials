<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initView() {
        $view = new Zend_View();
        $view->headTitle('マイプロジェクト')->setSeparator(' | ');
        return $view;
    }
}

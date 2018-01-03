<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
    protected function _initView() {
        $view = new Zend_View();
        $view->headTitle('マイプロジェクト')->setSeparator(' | ');
        return $view;
    }

    /*
    protected function _initRouter() {
        $this->bootstrap('FrontController');
        $front = $this->getResource('FrontController');
        $router = $front->getRouter();

        ## カスタマイズルート追加
        $r = new Zend_Controller_Router_Route(
            'author/:name/:id/*',
            array('controller'=>'Trial', 'action'=>'added-route',
                'name'=>'ian', 'id'=>99)
        );
        $router->addRoute('author', $r);
        return $router;
    }
     */
}

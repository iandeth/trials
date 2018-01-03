<?php

class BDCard2_Controller_Action extends Zend_Controller_Action
{
    public function init() {
        parent::init();

        ## IE9 + Facebook IFrame で cookie が飛んでこない現象
        ## の解決方法:
        ## http://memories.zal.jp/WP/20110322_1978.html
        $this->getResponse()->setHeader('P3P', "CP='UNI CUR OUR'");

        ## デバッグ表示
        if (APPLICATION_ENV == 'development')
            $this->view->allParams = $this->_getAllParams();
    }
}



<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.form.html

## Form 初期設定
$form = new Zend_Form(array(
    'action'  => '',
    'method'  => 'post',
    # 'enctype' => Zend_Form::ENCTYPE_MULTIPART,
    'attribs' => array( 'id'=>'contact' )
));

## 要素を追加
$form->addElement('text', 'username', array(
    'label' => 'ユーザー名',
    'required' => true
))->addElement('text', 'nickname', array(
    'label' => 'ニックネーム',
    'description' => '英数文字で入れてね',
    'value' => 'bobby',
    'validators' => array(
        'alnum',
        array('regex', false, '/^[a-z]/i')
    ),
    'required' => true,
    'filters'  => array('StringToLower'),
))->addElement('password', 'password', array(
    'label' => 'パスワード',
    'validators' => array(
        array('stringLength', false, array(6))
    ),
    'required' => true
))->addElement('radio', 'gender', array(
    'label' => '性別',
    'required' => true,
    # 'separator' => '&nbsp;&nbsp;',
    'multiOptions' => array(
        array('key'=>'M', 'value'=>'男'),
        array('key'=>'F', 'value'=>'女')
    )
))->addElement('submit', 'login', array(
    'label' => '送信'
));

## View 処理
$view = new Zend_View(array('scriptPath' => APP_ROOT.'/view'));
$view->form = $form;    # stash
$form->setView($view);  # これも必要
echo $view->render('form.php');

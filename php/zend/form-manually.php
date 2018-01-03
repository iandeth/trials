<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.form.html

## エラーメッセージ日本語化
Zend_Locale::setDefault('ja_JP');
$loc = new Zend_Locale('ja_JP');
$tr = new Zend_Translate(array(
    'adapter' => 'array',
    'content' => APP_ROOT.'/ZendFramework/resources/languages/ja/Zend_Validate.php',
    'locale'  => $loc
));
Zend_Registry::set('Zend_Locale', $loc);
Zend_Registry::set('Zend_Translate', $tr);

## Form 初期設定
$form = new Zend_Form(array(
    'action'  => '',
    'method'  => 'post'
    # 'enctype' => Zend_Form::ENCTYPE_MULTIPART,
));

## 要素を追加
$form->addElement('text', 'username', array(
    'label' => 'ユーザー名',
    'validators' => array(
        'alnum',
        array('regex', false, '/^[a-z]/i')
    ),
    'required' => true
))->addElement('radio', 'gender', array(
    'label' => '性別',
    'required' => true,
    'multiOptions' => array(
        array('key'=>'M', 'value'=>'男'),
        array('key'=>'F', 'value'=>'女')
    ),
    'separator' => '&nbsp;&nbsp;'
))->addElement('password', 'password', array(
    'label' => 'パスワード'
))->addElement('multiCheckbox', 'age', array(
    'label' => '年代',
    'required' => true,
    'multiOptions' => array(
        array('key'=>'10', 'value'=>'10代'),
        array('key'=>'20', 'value'=>'20代'),
        array('key'=>'30', 'value'=>'30代'),
        array('key'=>'40', 'value'=>'40代'),
        array('key'=>'50', 'value'=>'50代'),
        array('key'=>'60', 'value'=>'60代')
    ),
    'separator' => '&nbsp;&nbsp;'
))->addElement('submit', 'login', array(
    'label' => '送信'
));

## View 処理
$view = new Zend_View(array('scriptPath' => APP_ROOT.'/view'));
$view->form = $form;    # stash
$form->setView($view);  # これも必要

## Validation
$view_tmpl = 'form-manually.php';
if(array_keys($_POST)){
    $form->isValid($_POST);
    $fvals = $form->getValues();
    $view->fvals = $fvals;

    ## custom validation
    if( count($fvals['age']) > 2 ){
        $form->getElement('age')->addError('最大2つまでです');
        $form->markAsError();  # これ忘れずに
    }

    if( !$form->isErrors() )
        $view_tmpl = 'form-manually-complete.php';
}

## Render View
echo $view->render($view_tmpl);

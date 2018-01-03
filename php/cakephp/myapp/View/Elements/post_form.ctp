<?php
	echo $this->Form->input('category_id', array('label'=>'カテゴリ', 'empty' => ''));
	echo $this->Form->input('title', array('label'=>'タイトル'));
	echo $this->Form->input('body', array('label'=>'本文', 'rows'=>'3'));
	echo $this->Form->input('Tag', array('label'=>'タグ', 'type'=>'select', 'multiple'=>'checkbox'));
?>


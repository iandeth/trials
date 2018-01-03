<?php
	$this->Html->addCrumb('マイページ', '/users');
	$this->Html->addCrumb('エントリ一覧', '/posts');
	$this->Html->addCrumb('エントリ編集', '');
?>
<div class="users form">
<?php echo $this->Form->create('Post') ?>
    <fieldset>
        <legend>エントリ編集</legend>
		<?php echo $this->element('post_form') ?>
    </fieldset>
<?php echo $this->Form->end('保存する') ?>
<div style="text-align:right">
	<?php echo $this->Form->postLink(
		'エントリを削除する',
		array('action'=>'delete', $this->request->pass[0]),
		array('confirm'=>'本当に削除してもよろしいですか？'));
	?>
</div>
</div> 

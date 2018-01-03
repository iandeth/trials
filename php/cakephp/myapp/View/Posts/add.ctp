<?php
	$this->Html->addCrumb('マイページ', '/users');
	$this->Html->addCrumb('エントリ一覧', '/posts');
	$this->Html->addCrumb('エントリ新規作成', '');
?>
<div class="users form">
<?php echo $this->Form->create('Post') ?>
    <fieldset>
        <legend>エントリ新規作成</legend>
		<?php echo $this->element('post_form') ?>
    </fieldset>
<?php echo $this->Form->end('作成する') ?>
</div> 

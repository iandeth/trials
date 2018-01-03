<?php
	$this->Html->addCrumb('マイページ', '/users');
	$this->Html->addCrumb('登録情報編集', '/users/edit');
	$this->Html->addCrumb('メールアドレス変更', '');
?>

<div class="users form">
<?php echo $this->Form->create('User') ?>
    <fieldset>
        <legend>メールアドレス変更</legend>
		<div class="input text">
			<label>現在のメールアドレス</label>
			<?php echo h($emailnow) ?>
		</div>
		<?php
			echo $this->Form->input('email', array('label'=>'新しいメールアドレス'));
		?>
    </fieldset>
<?php echo $this->Form->end('変更する') ?>
</div> 



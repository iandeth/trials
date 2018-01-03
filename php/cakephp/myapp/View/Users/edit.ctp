<?php
	$this->Html->addCrumb('マイページ', '/users');
	$this->Html->addCrumb('登録情報編集', '');
?>

<div class="users form">
<?php echo $this->Form->create('User') ?>
    <fieldset>
        <legend>登録情報編集</legend>
		<?php
			echo $this->Form->input('username', array('label'=>'ユーザー名 (英数)'));
		?>
		<div class="input text">
			<label>メールアドレス</label>
			<?php echo h($email) ?>&nbsp;&nbsp;
			<?php echo $this->Html->link('メールアドレス変更', array('action'=>'email')) ?>
		</div>
		<?php
			echo $this->Form->input('role', array(
				'options'=>array('user'=>'一般ユーザー', 'admin'=>'管理者')
			));
		?>
    </fieldset>
<?php echo $this->Form->end('更新する') ?>
	<div style="text-align:right">
		<?php echo $this->Html->link('サービスを退会する', array('action'=>'delete')) ?>
	</div>
</div> 


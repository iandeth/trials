<?php $r = $this->Session->read('User.add2') ?>
<div class="users form">
<?php echo $this->Form->create('User') ?>
    <fieldset>
        <legend>以下の情報でよろしいですか？</legend>
		<div class="input text">
			<label>メールアドレス</label>
			<?php echo h($r['User']['email']) ?>
		</div>
		<div class="input text">
			<label>ユーザー名 (英数)</label>
			<?php echo h($r['User']['username']) ?>
		</div>
		<div class="input text">
			<label>パスワード</label>
			<?php array_map(
				function($s){ echo '*'; }, 
				str_split($r['User']['password'])
			) ?>
		</div>
    </fieldset>
	<?php echo $this->Form->submit('戻る', array('name'=>'_back', 'style'=>'background: #FF0000')) ?>
<?php echo $this->Form->end('次へ') ?>
</div> 

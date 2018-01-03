<h2>確認失敗</h2>
<?php if (isset($is_already_done)): ?>
	<p>そのメールアドレスは既にユーザー登録が完了しています</p>
<?php else: ?>
	<p>メール確認の期限が切れました。再度登録からやり直してください</p>
	<?php echo $this->Html->link('ユーザー登録はこちら', array('action'=>'add')) ?>
<?php endif ?>

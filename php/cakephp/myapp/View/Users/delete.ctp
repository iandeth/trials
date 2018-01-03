<?php
	$this->Html->addCrumb('マイページ', '/users');
	$this->Html->addCrumb('登録情報編集', '/users/edit');
	$this->Html->addCrumb('退会', '');
?>

<div class="users form">
    <fieldset>
        <legend>サービス退会</legend>
		<p>退会しない方が良い理由的な文章をつらつらとここに...</p>
		<p>退会しない方が良い理由的な文章をつらつらとここに...</p>
		<p style="margin-bottom:30px">退会しない方が良い理由的な文章をつらつらとここに...</p>
		<?php echo $this->Form->postLink(
			'退会する',
			array('action'=>'delete'),
			array('confirm'=>'本当に退会してもよろしいですか？'));
		?>
    </fieldset>
</div> 



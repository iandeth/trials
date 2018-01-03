<h2>確認メールを送信しました</h2>
<p>登録メールアドレスに送られてくるメールを確認ください</p>

<?php 
	if (isset($mail))
		echo $this->element('debug_sent_mail', array('mail'=>$mail));
?>

<?php 
	## 開発環境ならば送信したメール内容をブラウザに表示
	#if (defined('APP_ENV') && !in_array(APP_ENV, array('production', 'staging'))) {
		echo '<hr style="margin:50px 0 30px 0"/>';
		echo '<h3>開発用: 送信メール内容</h3>';
		echo "<pre>$mail[headers]</pre><br/>";
		echo "<pre>$mail[message]</pre>";
	#}
?>

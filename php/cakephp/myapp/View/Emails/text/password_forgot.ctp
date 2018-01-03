パスワード再設定
<?php echo $user['User']['username'] ?>さん
以下の URL をクリックしてパスワードを再設定してください：

<?php echo $this->Html->url(array('controller'=>'users', 'action'=>'password_forgot_confirmed', $hash), true) ?>

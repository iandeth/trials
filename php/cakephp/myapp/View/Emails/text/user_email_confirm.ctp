メールアドレス変更確認
<?php echo $user['username'] ?>さん
以下の URL をクリックして変更作業を完了させてください：

<?php echo $this->Html->url(array('controller'=>'users', 'action'=>'email_mail_confirmed', $hash), true) ?>

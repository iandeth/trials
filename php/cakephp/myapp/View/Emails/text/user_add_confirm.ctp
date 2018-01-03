ユーザー登録認証
<?php echo $user['username'] ?>さん
以下の URL をクリックして登録作業を完了させてください：

<?php echo $this->Html->url(array('controller'=>'users', 'action'=>'add_mail_confirmed', $hash), true) ?>

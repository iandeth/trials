<div class="users form">
<?php echo $this->Form->create('User') ?>
    <fieldset>
        <legend>ログイン</legend>
    <?php
        # echo $this->Form->input('username', array('label'=>'ユーザー名'));
        echo $this->Form->input('email', array('label'=>'メールアドレス'));
        echo $this->Form->input('password', array('label'=>'パスワード'));
    ?>
    </fieldset>
<?php echo $this->Form->end('ログインする') ?>
<p style="margin-top:30px"><?php echo $this->Html->link('パスワードを忘れた場合', array('controller'=>'users', 'action'=>'password_forgot')) ?></p>
</div>

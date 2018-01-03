<div class="users form">
<?php echo $this->Form->create('User') ?>
    <fieldset>
        <legend>パスワード再設定</legend>
        <p>登録メールアドレスを入力してください。再設定確認のメールが送信されます。</p>
        <?php echo $this->Form->input('email',  array('label'=>'メールアドレス')) ?>
    </fieldset>
<?php echo $this->Form->end('確認メールを送信') ?>
</div> 



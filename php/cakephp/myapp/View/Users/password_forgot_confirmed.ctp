<div class="users form">
<?php echo $this->Form->create('User') ?>
    <fieldset>
        <legend>パスワード再設定</legend>
    <?php
        echo $this->Form->input('password', array('type'=>'password', 'label'=>'新しいパスワード'));
		echo $this->Form->input('passconf', array('type'=>'password', 'label'=>'新しいパスワード (確認用)', 
			'div'=>array('class'=>'input password required')));
    ?>
    </fieldset>
<?php echo $this->Form->end('設定する') ?>
</div> 



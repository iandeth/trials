<?php
	$this->Html->addCrumb('マイページ', '/users');
	$this->Html->addCrumb('パスワード変更', '');
?>

<div class="users form">
<?php echo $this->Form->create('User') ?>
    <fieldset>
        <legend>パスワード変更</legend>
    <?php
		echo $this->Form->input('passnow',  array('type'=>'password', 'label'=>'現在のパスワード', 
			'div'=>array('class'=>'input password required')));
        echo $this->Form->input('password', array('type'=>'password', 'label'=>'新しいパスワード'));
		echo $this->Form->input('passconf', array('type'=>'password', 'label'=>'新しいパスワード (確認用)', 
			'div'=>array('class'=>'input password required')));
    ?>
    </fieldset>
<?php echo $this->Form->end('変更する') ?>
</div> 



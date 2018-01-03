<h2>passedArgs</h2>
<?php debug($this->passedArgs) ?>
<h2>params</h2>
<?php debug($this->request->params) ?>
<h2>link</h2>
<?php echo $this->Html->link('パーマリンク', array('controller'=>'trials', 
	'action'=>'custom_route_action', 'user_id'=>9876, 'post_id'=>'popopop')) ?>

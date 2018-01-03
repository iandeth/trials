<?php
	$description = 'CakePHP サンプルコード';
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php echo $this->Html->charset(); ?>
	<title>
		<?php echo $description ?>:
		<?php echo $title_for_layout; ?>
	</title>
	<?php
		echo $this->Html->meta('icon');
		echo $this->Html->css('cake.generic');
		echo $this->Html->script('jquery');

		echo $scripts_for_layout;
	?>
</head>
<body>
	<div id="container">
		<div id="header">
			<div style="float:right">
			<?php
				## ログイン画面の場合は何も表示しない
				if ($this->request->params['controller'] != 'users' || $this->request->params['action'] != 'login'){
					$opt = array('style'=>'color:white');
					if ($this->Session->read('Auth.User'))
						echo $this->Html->link('ログアウト', array('controller'=>'users', 'action'=>'logout'), $opt);
					else
						echo $this->Html->link('ログイン', array('controller'=>'users', 'action'=>'login'), $opt);
				}
			?>
			</div>
			<h1><?php echo $this->Html->link($description, '/'); ?></h1>
		</div>
		<div id="content">

			<?php echo $this->Session->flash(); ?>
			<?php echo $this->Session->flash('auth'); ?>
			<?php echo $this->Session->flash(null, array('element'=>'flash_green')); ?>

			<div id="breadcrumb" style="margin-bottom:20px">
				<?php echo $this->Html->getCrumbs(h(' > ')) ?>
			</div>

			<?php echo $content_for_layout; ?>

		</div>
		<div id="footer">
			<?php echo $this->Html->link(
					$this->Html->image('cake.power.gif', array('border' => '0')),
					'http://www.cakephp.org/',
					array('target' => '_blank', 'escape' => false)
				);
			?>
		</div>
	</div>
	<?php echo $this->element('sql_dump'); ?>
	<?php
		if (isset($this->request->query['ds']))
			var_dump($_SESSION);
	?>
</body>
</html>

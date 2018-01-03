<h2><?php echo h($user['username']) ?> さんのマイページ</h2>
<ul>
<li><?php echo $this->Html->link('エントリ一覧', array('controller'=>'posts', 'action'=>'index')) ?></li>
<li><?php echo $this->Html->link('登録情報編集', array('action'=>'edit')) ?></li>
<li><?php echo $this->Html->link('パスワード変更', array('action'=>'password')) ?></li>
</ul>
<br/>
<?php debug($user) ?>

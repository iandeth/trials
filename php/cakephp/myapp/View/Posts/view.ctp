<h2><?php echo h($post['Post']['title']) ?></h2>
<p>
カテゴリ: <?php echo h($post['Category']['name']) ?><br/>
タグ: <?php echo implode(', ', array_map(function($a){ return h($a['name']); }, $post['Tag'])) ?><br/>
投稿者: <?php echo h($post['User']['username']) ?><br/>
作成日時: <?php echo $this->Time->format('Y/m/d H:i', $post['Post']['created']) ?>
</p>
<p><?php echo nl2br(h($post['Post']['body'])) ?></p>
<?php debug($post) ?>

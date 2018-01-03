<?php $r = $post['Post'] ?>
<h1><?php echo $r['title']?></h1>
<p><small>Created: <?php echo $r['created']?></small></p>
<p><?php echo str_replace("\n", '<br/>', $r['body'] )?></p>

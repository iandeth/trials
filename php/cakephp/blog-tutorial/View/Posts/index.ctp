<h1>Blog posts</h1>
<?php echo $this->Html->link('Add Post', array('controller'=>'posts', 'action'=>'add')) ?>
<table>
    <tr>
        <th>Id</th>
        <th>Title</th>
        <th>Action</th>
        <th>Created</th>
    </tr>

    <?php foreach ($posts as $post): ?>
    <?php $r = $post['Post'] ?>
    <tr>
        <td><?php echo $r['id'] ?></td>
        <td>
            <?php echo $this->Html->link(
                $r['title'], array('controller'=>'posts', 'action'=>'view', $r['id'])
            ) ?>
        </td>
        <td>
            <?php echo $this->Form->postLink(
                'Delete',
                array('action'=>'delete', $r['id']),
                array('confirm'=>'Are you sure?'));
            ?>
            <?php echo $this->Html->link('Edit', array('action'=>'edit', $r['id'])) ?>
        </td>
        <td><?php echo $r['created'] ?></td>
    </tr>
    <?php endforeach ?>

</table>

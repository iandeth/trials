<div class="wrap">
    <div id="icon-edit" class="icon32 icon32-posts-post"><br /></div>
    <h2>Product Foo Bar</h2>
</div><!-- .wrap -->
<h3>Published Or Draft List</h3>
<div style="margin:10px 20px 0 0; background: #DDD; height:300px">
    <?php
        global $wpdb, $post;
        $query = "
            SELECT   $wpdb->posts.* 
            FROM     $wpdb->posts
            WHERE    $wpdb->posts.post_type = 'myapp_product'
                AND  $wpdb->posts.post_status IN ('draft', 'publish')
            ORDER BY $wpdb->posts.post_date DESC
        ";
        $posts = $wpdb->get_results($query, OBJECT);
    ?>
    <ul>
    <?php foreach ($posts as $post): ?>
        <?php setup_postdata($post) ?>
        <li><?php echo the_title() ?> - <a href="<?php the_permalink() ?>">preview</a></li>
    <?php endforeach ?>
    </ul>
</div>
<h3>More Content</h3>
<p>some custom content</p>

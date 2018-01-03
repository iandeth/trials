<?php
## CT => Custom Type
class MyApp_CT extends MyApp {

    public $post_type = 'myapp_product';

    function init() {
        parent::init();
        $p =& $this;
        ## init
        add_action('init', function() use($p) {
            $p->register_post_type();
        });
        ## http://codex.wordpress.org/Function_Reference/register_activation_hook
        ## since below will not work with plugin directory as symlink -
        ## register_activation_hook(__FILE__, $func);
        ## so instead:
        $file = MYAPP_PLUGIN_DIR_PATH . basename(__FILE__);
        register_activation_hook($file, function() use($p) {
            $p->register_post_type();
            ## need this to update permalink rewrite settings
            flush_rewrite_rules();
        });
    }

    ## http://codex.wordpress.org/Function_Reference/register_post_type
    ## this will be called twice upon admin plugin activation.
    function register_post_type() {
        register_post_type($this->post_type,
            array(
                'labels' => array(
                    'name' => 'Products',
                    'all_items' => 'All Products',
                    'singular_name' => 'Product',
                    'edit_item' =>  'Edit Product',
                    'new_item' => 'New Product',
                ),
                'public' => true,
                'has_archive' => true,
                'menu_position' => 5,
                'supports' => array(
                    'title', 'editor', 
                    # 'custom-fields', 'comments', 'revisions',
                ),
                'register_meta_box_cb' => array(&$this, 'add_meta_boxes'),
                'taxonomies' => array(
                    # 'category', 'post_tag'
                ),
                'rewrite' => array(
                    'slug' => 'hoge'
                ),
            )
        );
    }

    function add_meta_boxes($post) {
        // empty function for this parent class.
        // see admin.php
    }

}


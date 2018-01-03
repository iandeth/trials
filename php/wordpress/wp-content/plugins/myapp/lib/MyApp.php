<?php
class MyApp {

    public $base_dir = null;
    public $url = MYAPP_PLUGIN_URL;
    public $dir_path = MYAPP_PLUGIN_DIR_PATH;

    function __construct() {
        if ($this->base_dir) {
            $this->url = implode('', array(MYAPP_PLUGIN_URL, $this->base_dir, '/'));
            $this->dir_path = implode('', array(MYAPP_PLUGIN_DIR_PATH, $this->base_dir, '/'));
        }
    }

    function init() {
        add_action('admin_footer', function() {
            var_dump('myapp_init called');
        });
    }
}


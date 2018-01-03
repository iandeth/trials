<?php
class MyApp_Hello extends MyApp {

    public $base_dir = 'hello';

    function init() {
        parent::init();
        $p = $this;
        ## admin_footer
        add_action('admin_footer', function() {
            var_dump('myapp_hello_init called');
        });
        ## admin_head
        add_action('admin_head', function() use($p) {
            echo '<link rel="stylesheet" type="text/css" href="' .
                $p->url . 'style.css">';
        });
        ## admin_notices
        add_action('admin_notices', function() use($p) {
            var_dump(MYAPP_PLUGIN_URL);
            var_dump($p->url);
            var_dump(MYAPP_PLUGIN_DIR_PATH);
            var_dump($p->dir_path);
            echo '<p id="foo">あいうえお</p>';
        });
    }

}


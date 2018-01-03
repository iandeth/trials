<?php
class MyApp_CT_Public extends MyApp_CT {

    public $base_dir = 'custom-type/public';

    function init() {
        parent::init();
        $p = $this;
        ## footer
        add_action('footer', function() {
            var_dump('myapp_ct_public_init called');
        });
        ## head
        add_action('head', function() use($p) {
            echo '<link rel="stylesheet" type="text/css" href="' .
                $p->url . 'style.css">';
        });
    }

}



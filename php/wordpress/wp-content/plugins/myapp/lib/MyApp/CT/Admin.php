<?php
class MyApp_CT_Admin extends MyApp_CT {

    public $base_dir = 'custom-type/admin';
    public $view = null;  // Zend_View instance

    function init() {
        parent::init();
        $p =& $this;
        ## need to start session manually
        ## if we want to use $_SESSION in plugin
        # if (!session_id())
        #     session_start();

        ## init view instance
        $this->view = new Zend_View(array('scriptPath'=>$this->dir_path . 'tmpl'));
        $this->view->p = $p;  // stashed self
        ## load css/javascript
        add_action('admin_enqueue_scripts', function($hook) use($p) {
            wp_register_script('admin-js', $p->url . 'script.js');
            wp_enqueue_script('admin-js');
            wp_register_style('admin-css', $p->url . 'style.css');
            wp_enqueue_style('admin-css');
        });
        ## register ajax apis
        add_action('wp_ajax_validate_data', array(&$this, 'ajax_validate_data'));
        ## meta-box save hook
        add_action('save_post', array(&$this, 'save_post'));
        ## add sub-menus
        add_action('admin_menu', function() use($p) {
            add_submenu_page(
                'edit.php?post_type=' . $p->post_type,  # parent menu slug|url
                'Product Foo Bar',  # page title
                'Foo Bar',          # sub menu text
                'publish_posts',    # role (capability)
                'sub-menu-foobar',  # unique id
                array(&$p, 'render_admin_page_foobar'));
        });
        ## post list table columns
        ## - specify column header
        add_filter('manage_' . $this->post_type . '_posts_columns', function($cols) use($p) {
            unset($cols['date']);
            return array_merge($cols, array(
                'buz' => 'Buz',
                'qux' => 'Qux',
                'date' => __('Date'),
            ));
        });
        ## - define column values
        add_action('manage_' . $this->post_type . '_posts_custom_column', function($col, $post_id) use($p) {
            $m = get_post_meta($post_id, $p->post_type, true);
            switch ($col) {
                case "buz":
                    echo $m[$col];
                    break;
                case "qux":
                    echo implode(', ', $m[$col]);
                    break;
            }
        }, 10, 2);
        ## - define sortable columns
        add_filter('manage_edit-' . $this->post_type . '_sortable_columns', function($cols) use($p) {
            return array_merge($cols, array(
                'buz'=>'buz', 'qux'=>'qux'
            ));
        });
        ## admin_footer
        add_action('admin_footer', function() {
            var_dump('myapp_ct_admin_init called');
        });
    }

    function add_meta_boxes($post) {
        $p =& $this;
        ## get current meta data
        $data = get_post_meta($post->ID, $this->post_type, true);
        $data = $this->_normalize_data($data);
        ## debug
        add_action('admin_footer', function() use($data) {
            var_dump($data);
            var_dump($_SESSION);
        });
        ## main meta box (with form fillin)
        $html_cb = function() use($p, $data) {
            $p->view->data = $data;
            echo $p->view->render('meta-box-products.php');
        };
        add_meta_box(
            'meta-box-products',
            'Product Specs',
            $html_cb,
            null,
            'normal'
        );
        ## another meta box (with form fillin)
        $html_cb = function() use($p, $data) {
            $p->view->data = $data;
            echo $p->view->render('meta-box-categories.php');
        };
        add_meta_box(
            'meta-box-categories',
            'Wee Categories',
            $html_cb,
            null,
            'side'
        );
    }

    function ajax_validate_data() {
        $data = $this->_normalize_data($_POST['ct']);
        $ret = $this->_validate_data($data);
        $res = array('error_html'=>null);
        if (count($ret['errors']) > 0) {
            $this->view->form = $ret['form'];
            $this->view->errors = $ret['errors'];
            $res['error_html'] = $this->view->render('validate-error-ajax.php');
        }
        echo json_encode($res);
        die();  # required
    }

    function save_post($post_id) {
        ## do nothig if autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) 
            return;
        ## do nothing if not my post_type
        if (!isset($_POST['post_type']) || $_POST['post_type'] != $this->post_type)
            return;
        ## CSRF (nonce) validation
        if (!wp_verify_nonce($_POST[$this->post_type . '_nonce'], $this->post_type))
            return;
        ## authorization
        if (!current_user_can('edit_post', $post_id))
            return;
        ## format save data
        $data = $this->_normalize_data($_POST['ct']);
        ## data validation
        $ret = $this->_validate_data($data);
        if (count($ret['errors']) > 0) {
            $this->view->form = $ret['form'];
            $this->view->errors = $ret['errors'];
            $msg = $this->view->render('validate-error.php');
            wp_die($msg, 'validation error');
        }
        ## save
        update_post_meta($post_id, $this->post_type, $data);
        return;
    }

    function render_admin_page_foobar() {
        echo $this->view->render('admin_page_foobar.php');
    }

    protected function _normalize_data(&$post) {
        if (!is_array($post))
            $post = array();
        $data = array(
            'foo' => '',
            'bar' => null,
            'buz' => '',
            'qux' => array(),
        );
        foreach ($data as $k=>$v) {
            if (isset($post[$k]))
                $data[$k] = $post[$k];
        }
        return $data;
    }

    protected function _validate_data(&$data) {
        if (!is_array($data))
            die('$data is not an array');
        $form = new Zend_Form();
        $form->addElement('text', 'foo', array(
            'label' => 'ふう',
            'required' => false,
            'validators' => array(
                array('callback', false, function($v) {
                    return ($v == 'error')? false : true;
                })
            ),
        ))->addElement('radio', 'buz', array(
            'label' => 'バズ',
            'required' => true,
            'multiOptions' => array(
                array('key'=>'dog', 'value'=>''),
                array('key'=>'cat', 'value'=>''),
                array('key'=>'mouse', 'value'=>'')
            ),
        ));

        $ret = array('form'=>$form, 'errors'=>array());
        if (!$form->isValid($data))
            $ret['errors'] = $form->getMessages();
        return $ret;
    }

}


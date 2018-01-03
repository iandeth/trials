<div>
    <label>foo</label><br/>
    <?php echo $this->formText('ct[foo]', $this->data['foo']) ?><br/><br/>
    <label>bar</label><br/>
    <?php echo $this->formRadio('ct[bar]', $this->data['bar'], null, array('1'=>'1 です', '2'=>'2 です', '3'=>'3 です'), '<br/>') ?>
    <br/>
    <label>qux</label><br/>
    <?php echo $this->formMultiCheckbox('ct[qux][]', $this->data['qux'], null, array(
        'a'=>'a よ', 'b'=>'b よ', 'c'=>'c よ'
    ), '<br/>') ?>
</div>
<?php
    wp_nonce_field($this->p->post_type, $this->p->post_type . '_nonce');
    var_dump($this->p->dir_path);

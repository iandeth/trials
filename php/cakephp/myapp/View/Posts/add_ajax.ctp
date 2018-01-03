<?php
	$this->Html->addCrumb('マイページ', '/users');
	$this->Html->addCrumb('エントリ一覧', '/posts');
	$this->Html->addCrumb('エントリ新規作成(AJAX)', '');

	$this->Html->script('add_ajax', array('inline'=>false));
?>
<script type="text/javascript">
var post;
$(function(){
	post = new Post({form:$('#PostAddAjaxForm')});
});
</script>
<div class="users form">
	<?php echo $this->element('post_form_ajax') ?>
</div> 

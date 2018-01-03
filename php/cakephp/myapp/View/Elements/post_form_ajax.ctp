<?php echo $this->Form->create('Post', array('onsubmit'=>'post.save(); return false;')) ?>
    <fieldset>
        <legend>エントリ新規作成 (AJAX 実装版)</legend>
		<?php
			echo $this->Form->input('category_id', array('label'=>'カテゴリ', 'empty'=>''));
			echo $this->Form->input('title', array('label'=>'タイトル'));
			echo $this->Form->input('body', array('label'=>'本文', 'rows'=>'3'));
			echo $this->Form->input('Tag', array('label'=>'タグ', 'type'=>'select', 'multiple'=>'checkbox'));
		?>
    </fieldset>
<?php echo $this->Form->end('作成する') ?>

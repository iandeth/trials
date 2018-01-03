<?php
	$this->Html->addCrumb('マイページ', '/users');
	$this->Html->addCrumb('エントリ一覧', '');
?>
<h2>エントリ一覧</h2>
<?php if (!$this->Paginator->hasPage()): ?>
	<p>まだエントリがありません</p>
<?php else: ?>
	<div class="counter">
	<?php
		echo $this->Paginator->counter('全 {:count} 件 - {:page} / {:pages} ページ表示中');
	?>
	</div>
	<div class="paging" style="margin-bottom:10px">
	<?php
		echo $this->Paginator->prev(' < ');
		echo $this->Paginator->numbers(
			array('separator'=>'', 'modulus'=>5, 'first'=>1, 'last'=>1)
		);
		echo $this->Paginator->next(' > ');
	?>
	</div>
	<table style="width:700px">
	<?php 
		echo $this->Html->tableHeaders(array(
			$this->Paginator->sort('id', 'ID'),
			$this->Paginator->sort('title', 'タイトル'),
			'カテゴリ', 
			'作成日時', 
			'アクション'
		));
		$cells = array();
		foreach ($posts as $i=>$r) {
			$cells[] = array(
				array(h($r['Post']['id']), array('style'=>'width:40px')),
				$this->Html->link(h($r['Post']['title']), array('action'=>'edit', $r['Post']['id'])),
				array(h($r['Category']['name']), array('style'=>'width:100px')),
				array($this->Time->format('Y/m/d H:i', $r['Post']['created']), array('style'=>'width:150px')),
				array(
					$this->Html->link('確認', array('action'=>'view', $r['Post']['id']), array('target'=>'_blank')) .
					'&nbsp;&nbsp;' .
					$this->Html->link('編集', array('action'=>'edit', $r['Post']['id'])),
					array('style'=>'width:100px')
				),
			);
		}
		echo $this->Html->tableCells($cells);
	?>
	</table>
<?php endif ?>
<br/>
<p><?php echo $this->Html->link('エントリを新規作成する', array('action'=>'add')) ?></p>
<p><?php echo $this->Html->link('エントリを新規作成する (AJAX 実装版)', array('action'=>'add_ajax')) ?></p>

<?php
class Task2Task extends Shell {

	public function getOptionParser() {
		return ConsoleOptionParser::buildFromArray(array(
			'command' => 'task2',
			'description' => array(
				'Task2 の説明文'
			),
			'arguments' => array(
				'foo' => array(
					'help' => 'ふー',
				),
			),
			'options' => array(
				'filter' => array(
					'help' => 'フィルター',
					'choices' => array('on', 'off'),
				),
			),
		));
	}

	public function execute() {
		$this->out('Task2 実行しました', 2);
	}

}


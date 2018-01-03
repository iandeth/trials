<?php
class Task1Task extends Shell {

	public function getOptionParser() {
		return ConsoleOptionParser::buildFromArray(array(
			'command' => 'task1',
			'description' => array(
				'Task1 の説明文'
			),
			'arguments' => array(
				'task1_id' => array(
					'help' => 'タスク1 ID を指定',
					'required' => true,
				),
			),
			'options' => array(
				'debug' => array(
					'help' => 'デバッグフラグ',
					'boolean' => true,
				),
			),
		));
	}

	public function execute() {
		$this->out('Task1 実行しました', 2);
	}

}

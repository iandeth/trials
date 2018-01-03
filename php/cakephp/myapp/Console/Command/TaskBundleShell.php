<?php
class TaskBundleShell extends AppShell {

	public $tasks = array('Task1', 'Task2');

	public function getOptionParser() {
		$p = parent::getOptionParser();
		$p->addSubcommand('task1', array(
			'help'   => 'あれをこうするヤツ',
			'parser' => $this->Task1->getOptionParser(),
		));
		$p->addSubcommand('task2', array(
			'help'   => 'こっちの何をどうこうする',
			'parser' => $this->Task2->getOptionParser(),
		));
		return $p;
	}

	## ヘッダー表示ブロック
	public function _welcome (){
		$this->out('<info>Sub Command 実装サンプル</info>');
		$this->out('複数タスクを束ねたシェルです');
		$this->hr(1);
	}

	public function main() {
		$this->out('以下の sub command があります:');
		foreach ($this->taskNames as $n)
			$this->out('- ' . $n);

		## あるいは --help と同内容を表示
		#$this->out($this->getOptionParser()->help());
	}
}


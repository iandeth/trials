<?php
class HelloShell extends AppShell {

	## 直接使う Model 指定
	public $uses = array('User');

	## Console/Comman/Task 下の task class に
	## 処理コードを集約可能。使う Task を指定
	public $tasks = array('Sample');

	## シェル引数・オプションを定義
	public function getOptionParser() {
		$p = parent::getOptionParser();
		## ヘルプ説明文
		$p->description(array(
			'説明文２行目です。あららら。',
			'説明文３行目です。ほれれれ。',
		));
		$p->epilog(array(
			'末尾文１行目です。あららら。',
			'末尾文２行目です。ふももも。',
		));
		## シェル引数
		$p->addArguments(array(
			'user_id' => array(
				'help' => 'ユーザー ID 指定',
				# 'required' => true,
			),
			'action' => array(
				'help' => '処理指定',
				'choices' => array('create', 'update', 'delete'),
			),
		));
		## オプション
		$p->addOptions(array(
			'filter' => array(
				'short' => 'f',
				'help' => 'フィルター文字列',
				'default' => '',
				'choices' => array('foo', 'bar'),
			),
			'debug' => array(
				'short' => 'd',
				'help' => 'デバッグモード',
				'boolean' => true,
			),
		));
		return $p;
	}

	## ヘッダー表示ブロック
	public function _welcome (){
		$this->out('<info>ハローシェル</info>');
		$this->out('シェルスクリプトのサンプル実装');
		$this->hr(1);
	}

	public function main() {
		$this->out('ハローワールド');
		debug($this->args);
		debug($this->params);
	}

	public function hey_there() {
		$this->out('Hey there ' . $this->args[0]);
	}

	public function user() {
		$user = $this->User->findById($this->args[0]);
		$this->out(print_r($user, true));
	}

	public function user_by_task() {
		$this->Sample->execute();
	}

	public function out_format() {
		## 第二引数で改行個数を指定
		$this->out("改行ふたつ", 2);

		## 第三引数で --quiet --verbose 表示レベル設定
		$this->out("quiet   msg", 1, Shell::QUIET);
		$this->out('normal  msg', 1, Shell::NORMAL);
		$this->out('normal2 msg', 1);
		$this->out('verbose msg', 1, Shell::VERBOSE);

		## 罫線 - 引数: 0=前後改行数, 1=線幅文字数
		$this->hr();
		$this->hr(1, 20);

		## 単純な改行出力
		$this->out($this->nl(2));
		
		## タグでスタイル指定
		## http://book.cakephp.org/2.0/en/console-and-shells.html#styling-output
		## to disable colors:
		#$this->stdout->outputAs(ConsoleOutput::PLAIN);
		$this->out('<error>エラーです</error> 詳細はほげほげ');
		$this->out('<warning>警告です</warning> foobar');
		$this->out('<info>通知ッス</info> あいうえお');
		$this->out('<comment>コメントです</comment> hogege');
		$this->out('<question>質問です？</question> what?');

		## STDERR へ出力 (aka warn)
		$this->err('stderr 出力です', 2);  # 引数は out() と同じ

		## indent, word wrap 等々整形
		$t = "Starts up the Shell and displays the welcome message. " .
			"Allows for checking and configuring prior to command or main execution" .
			"Override this method if you want to remove the welcome information, " .
			"or otherwise modify the pre-command flow.";
		$this->out(
			$this->wrapText($t, array(
				'indent' => '    ',
				'width' => 50,
			)),
		2);

		## wrapText() 日本語テキストで wordWrap=>false 設定にしたいけど、
		## これだと multibyte 対応が出来て無くて NG な模様。
		$t = "日常生活の中、最も身近でかつ重要と思われる病気の治療に携わっております。" .
			"３大死因である心筋梗塞・脳卒中・癌の予防・早期発見を目標としております。" .
			"心筋梗塞、脳卒中の予防のため高血圧、高脂血症、糖尿病、痛風治療等に力を入れております。";
		$this->out(
			$this->wrapText($t, array(
				'indent' => '    ',
				'wordWrap' => false,
			)),
		2);
	}

	public function interactive() {
		$in = $this->in('Red or Green?', array('R', 'G'), 'R');
		debug($in);
	}

	public function wow() {
		## exit(1) する
		$this->error('こんなエラーが起きたよ', "あれがマズって\nこれもマズって。");
	}
}

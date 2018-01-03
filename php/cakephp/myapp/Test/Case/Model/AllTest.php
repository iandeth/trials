<?php
class AllModelTest extends CakeTestSuite {

	public static function suite() {
		$suite = new CakeTestSuite('All model tests');
		self::addTestDirectoryRecursiveNoSVN(TESTS . 'Case' . DS . 'Model', $suite);
		return $suite;
	}

	## subversion の .svn ディレクトリ配下を無視して recursive find する
	## 親クラスの addTestDirectoryRecursive() がダメだったので置き換え
	public static function addTestDirectoryRecursiveNoSVN($directory = '.', CakeTestSuite $suite) {
		$Folder = new Folder($directory);
		$files = $Folder->tree(null, false, 'files');
		foreach ($files as $file) {
			## ドットファイル|ディレクトリを無視
			if (preg_match('/\/\./', $file) || $file == __FILE__)
				continue;
			$suite->addTestFile($file);
		}
	}

}

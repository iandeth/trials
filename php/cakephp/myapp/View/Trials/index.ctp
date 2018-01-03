<h2>いろいろお試し</h2>
<ul>
<li><?php echo $this->Html->link('debug 出力', array('action'=>'debug')) ?></li>
<li><?php echo $this->Html->link('layout 切替', array('action'=>'layouts')) ?></li>
<li><?php echo $this->Html->link('element 読み込み', array('action'=>'elements')) ?></li>
<li><?php echo $this->Html->link('json レスポンス', array('action'=>'as_json')) ?></li>
<li><?php echo $this->Html->link('jsonp レスポンス', array('action'=>'as_jsonp', '?'=>'callback=hoge')) ?></li>
</ul>
<br/>
<h2>Controller - サンプルアプリ</h2>
<p>ユーザー登録 (with 確認メール)、ログイン認証、パスワード変更、メアド変更、退会<br/>
ブログエントリ一覧 (with paging)、新規作成、編集、削除、権限チェック<br/>
等々の機能を一通り実装してみた。</p>
<ul>
<li><?php echo $this->Html->link('ユーザー新規登録', array('controller'=>'users', 'action'=>'add')) ?></li>
<li><?php echo $this->Html->link('ログイン', array('controller'=>'users', 'action'=>'login')) ?></li>
</ul>
<br/>
<h2>Security Component お試し</h2>
<ul>
<li><?php echo $this->Html->link('HTTPS 必須なページに HTTP でアクセスしたら強制リダイレクト', 'http://' . $this->request->host() . '/secure_test' ) ?></li>
</ul>
<br/>
<h2>Model - Unit Test で色々試す</h2>
<p>詳しい内容はテストケースのソースコードを読むべし</p>
<ul>
<li>
  <?php echo $this->Html->link('$model->find(\'list\')', '/test.php?case=Model%2FTag&app=true&filter=FindList') ?>
  <pre>$ cake testsuite app Model/Tag --filter FindList</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('手動 transaction', '/test.php?case=Model%2FPost&app=true&filter=Transaction') ?>
  <pre>$ cake testsuite app Model/Post --filter Transaction</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('validation', '/test.php?case=Model%2FPost&app=true&filter=Validate') ?>
  <pre>$ cake testsuite app Model/Post --filter Validate</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('modified カラムの自動更新', '/test.php?case=Model%2FUser&app=true&filter=AutoUpdateModified') ?>
  <pre>$ cake testsuite app Model/User --filter AutoUpdateModified</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('hasMany 関係レコードの連動削除 users x posts', '/test.php?case=Model%2FUser&app=true&filter=DependentDelete') ?>
  <pre>$ cake testsuite app Model/User --filter DependentDelete</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('HABTM basic 型 posts x tags の同時保存', '/test.php?case=Model%2FPost&app=true&filter=CounterCache') ?>
  <pre>$ cake testsuite app Model/Post --filter CounterCache</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('HABTM join model 型 posts x tags の同時保存', '/test.php?case=Model%2FPost2&app=true&filter=CounterCache') ?>
  <pre>$ cake testsuite app Model/Post2 --filter CounterCache</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('HABTM basic 型での関係レコード連動削除', '/test.php?case=Model%2FPost&app=true&filter=HabtmDependentDelete') ?>
  <pre>$ cake testsuite app Model/Post --filter HabtmDependentDelete</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('HABTM join model 型での関係レコード連動削除', '/test.php?case=Model%2FPost2&app=true&filter=HabtmDependentDelete') ?>
  <pre>$ cake testsuite app Model/Post2 --filter HabtmDependentDelete</pre><br/>
</li>
</ul>
<br/>
<h2>Unit Test</h2>
<ul>
<li>
  <?php echo $this->Html->link('テスト一覧', '/test.php?show=cases&app=true') ?>
  <pre>$ cake testsuite app</pre><br/>
</li>
<li>
  <?php echo $this->Html->link('Model 関連の全テスト一括実行', '/test.php?case=Model%2FAll&app=true') ?>
  <pre>$ cake testsuite app Model/All</pre><br/>
</li>
</ul>
<br/>
<h2>コンソールスクリプト (CRON バッチ) のサンプル</h2>
<p>Console/Command/HelloShell.php に処理コードを書いた場合。</p>
<ul>
<li>
  main 処理を実行
  <pre>$ cake hello</pre><br/>
</li>
<li>
  指定 action を引数付きで実行
  <pre>$ cake hello hello_there ほげ</pre><br/>
</li>
<li>
  Model 利用 (User-&gt;findById(1))
  <pre>$ cake hello user 1</pre><br/>
</li>
<li>
  Task 利用 (SampleTask.php)
  <pre>$ cake hello user_by_task 1</pre><br/>
</li>
<li>
  Task 利用 - 直接呼び出し (SampleTask.php)
  <pre>$ cake hello sample 1</pre><br/>
</li>
<li>
  out() 色々な書式
  <pre>$ cake hello out_format

## quiet モード
$ cake hello out_format -q

## verbose モード
$ cake hello out_format -v</pre><br/>
</li>
<li>
  インタラクティブシェル
  <pre>$ cake hello interactive</pre><br/>
</li>
<li>
  エラー exit 方法
  <pre>$ cake hello wow</pre><br/>
</li>
<li>
  幾つもの Task をまとめた統合シェル
  <pre>$ cake task_bundle -h</pre><br/>
</li>
</ul>
<br/>
<h2>CakePHP デフォルトの画面</h2>
<ul>
<li>
  <?php echo $this->Html->link('/pages/home', '/pages/home') ?>
</li>

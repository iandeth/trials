<?php
$conf = require 'bootstrap.php';

## doc
# http://framework.zend.com/manual/en/zend.db.table.html

## テーブル状態初期化
$dbh = Zend_Db::factory( $conf->database );
Util::setupTableFooAndBar( $dbh );

## ORM 初期化
Zend_Db_Table_Abstract::setDefaultAdapter( $dbh );


echo "\n## insert\n";
$m = function () use( $dbh ){
    $sqlc = 'SELECT count(*) FROM foo';
    echo "count: " . $dbh->fetchOne( $sqlc ) . "\n";

    $foo = new Schema_Foo();
    ## Schema クラス未定義ならば以下で代用可能
    # $foo = new Zend_Db_Table('foo');
    
    $id = $foo->insert(array(
        'id'   => 99,
        'text' => 'eee'
    ));
    echo "insert id: $id\n";
    echo "count: " . $dbh->fetchOne( $sqlc ) . "\n";

    ## 拡張メソッド実行
    $foo->bark();
};
$m();


echo "\n## update via \$row\n";
$m = function () use( $dbh ){
    $foo = new Schema_Foo();
    $row = $foo->find( 99 )->current();
    echo "text before: " . $row->text . "\n";

    $row->text = 'EEE';
    $row->save();  # update + 再 select
    
    echo "text after: " . $row->text . "\n";
};
$m();


echo "\n## updating multiple rows\n";
$m = function () use( $dbh ){
    $foo = new Schema_Foo();
    $data = array( 'text'=>'updated' );
    ## where 句は bind を手動でやらんと駄目
    $where = $dbh->quoteInto( 'id >= ?', 4 );
    $foo->update( $data, $where );

    $rows = $foo->fetchAll(
        $foo->select()->where( 'id >= ?', 4 ) );
    foreach( $rows as $row ){
        echo "text after: " . $row->text .
            " (" . $row->id . ")\n";
    }
};
$m();


echo "\n## delete\n";
$m = function () use( $dbh ){
    $foo = new Schema_Foo();
    $row = $foo->find( 99 )->current();
    echo "row exists: " . $row->id . "\n";

    $row->delete();

    ## instance 側も空っぽになる
    echo "row: " . $row->text . "\n";

    ## DB からも消えてる
    $row = $foo->find( 99 )->current();
    if( !$row )
        echo "could not find row\n";

    ## 複数行 delete
    ## where 句は自分で quote しないと駄目
    $where = $dbh->quoteInto( 'id >= ?', 5 );
    $foo->delete( $where );
};
$m();


echo "\n## select\n";
$m = function () use( $dbh ){
    $foo = new Schema_Foo();

    ## 単行
    $row = $foo->fetchRow(
        $foo->select()->where( 'id = ?', 4 ) );
    echo "row: " . $row->id . "\n";

    ## 複数行
    $rows = $foo->fetchAll(
        $foo->select()->where( 'id <= ?', 2 ) );
    foreach( $rows as $row )
        echo "mrow: " . $row->id . "\n";

    ## JOIN 系... は
    ## えらく面倒なので素直に $dbh->select()
    ## や $dbh->query() を直接使うべし
};
$m();


echo "\n## select relational - childs\n";
$m = function () use( $dbh ){
    $foo = new Schema_Foo();

    $row = $foo->find( 4 )->current();
    echo "row: " . $row->id . "\n";

    $barRows = $row->findSchema_Bar();  ## magic: $row->find<TableClass>()
    # or,
    # $barRows = $row->findDependentRowset('Schema_Bar');
    foreach( $barRows as $brow ){
        echo implode( '', array(
            'brow: ', $brow->text, 
            ' (', $brow->foo_id, '-', $brow->id, ')',
            "\n"
        ));
    }
};
$m();


echo "\n## select relational - parent\n";
$m = function () use( $dbh ){
    $foo = new Schema_Bar();

    $row = $foo->find( 3 )->current();
    echo "row: " . $row->id . "\n";

    $foo = $row->findParentSchema_Foo();  ## magic: $row->findParent<TableClass>()
    # or,
    # $foo = $row->findParentRow('Schema_Foo');
    echo "foo: " . $foo->text . " (" . $foo->id . ")\n";
};
$m();

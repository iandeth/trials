<?php
array_shift( $argv );  # 余分な引数除去
$dir = realpath(dirname(__FILE__));


## 対象 DB を判定 (テスト用かどうか)
if( in_array('--test', $argv) || in_array('-t', $argv) ){
    echo "対象: テスト DB\n";
    $_ENV['APPLICATION_ENV'] = "test";  // test 用 config を読み込む様に
}


## 環境設定を読み込む等
$app = require 'bootstrap.php';
$db = $app->getBootstrap()->getResource('db');
$sqldir = realpath( $dir.'/../db/migrate' );


## ヘルプ表示
if( in_array('--help', $argv) || in_array('-h', $argv) ){
    show_help();
    exit;
}


## schema_info テーブルが無い場合...
$tbl_list = $db->listTables();
$tbl_cnt  = count($tbl_list);
$has_schema_info = in_array('schema_info', $tbl_list);
if( $tbl_cnt > 0 && !$has_schema_info ){
    die( "migration out of sync: \n" .
    "既に幾つかテーブルが存在しているも、schema_info が見当たらないよ。\n" .
    "手動で同期作業すべし。\n" .
    "=>エラー終了\n");
}else if( $tbl_cnt == 0 && !$has_schema_info ){
    ## 真っ新な DB なら schema_info を自動作成して続行
    $sql = <<<EOS
    CREATE TABLE `schema_info` (
      `version` int(11) DEFAULT 0
    ) ENGINE=InnoDB COMMENT='DB migration 用管理テーブル';
EOS;
    try {
        $db->query( $sql );
    }catch ( Exception $e ){
        echo "schema_info 作成失敗:\n";
        die( $e->getMessage() );
    }
    echo "初期化: schema_info テーブルを作成\n";
}


## 現在の migrate version 値を取得
$nowver = $db->fetchOne('SELECT version FROM schema_info');
if( !$nowver )
    $nowver = 0;
echo "現在の migrate version: $nowver\n";


## db/migrate/*.sql ファイル群を探す
$sql = array();
$files = scandir( $sqldir );
foreach ( $files as $i=>$f ){
    $m = array();
    if( !preg_match('/^(\d{3})_.+\.sql$/', $f, $m) )
        continue;  # ファイル名ルール不一致
    $ver = $m[1];
    if( $ver === '000' )     # 不正 version
        die( "invalid version: $ver" );
    if( isset($sql[$ver]) )  # version ダブり
        die( "duplicate version: $f" );
    $sql[$ver] = $f;
}


## version 差分の SQL を実行
foreach ($sql as $verstr=>$file){
    $ver = intval( $verstr );
    if( $ver <= $nowver ){
        echo "済みスキップ: $file\n";
        continue;
    }
    fwrite(STDOUT, "実行していい？ $file [y/N]");
    $in = trim(fgets(STDIN));
    if( !preg_match('/^y/i', $in) ){
        echo "キャンセルしました\n";
        exit;
    }
    $str = file_get_contents( "$sqldir/$file" );
    if( $str === false )
        die( "$sqldir/$file が読み込めなかった orz\n" );

    ## CREATE|ALTER TABLE 系は transaction 効かないので
    ## commit|rollback は使わない
    try {
        # SQL コメントを除去
        $str = preg_replace( '/\/\*.+?\*\//s', '', $str );
        # SQL statement 毎に分割
        $arr = preg_split( '/;\s*/', $str );
        foreach ($arr as $p){
            if( !$p )
                continue; // 空文字列は無視
            $db->query( $p );
            echo "=>成功\n$p\n\n";
        }
        ## 無事実施出来たので version を更新
        $db->delete( 'schema_info' );
        $data = array('version'=>$ver);
        $db->insert( 'schema_info', $data );
    }catch ( Exception $e ){
        echo "[失敗]\n";
        die( $e->getMessage() . "\n" );
    }
}
echo "=>完了: DB 定義は最新状態です\n";


## utils
function show_help (){
    echo <<<EOS

## DB migration ツール

usage:

  /path/to/php db-migrate.php [-t|--test] [-h|--help]

options:

  -t, --test
    ユニットテスト環境を対象に migration を実施。
    => library/config/localhost.test.php 等を読み込んで
    処理を実施する。

  -h, --help
    このヘルプを表示。


EOS;
}

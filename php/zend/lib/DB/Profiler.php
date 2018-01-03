<?php
/*
=SYNOPSIS

  開発用便利ツール - Zend DB Adapter まわり

=USAGE

  ## 1. 実行されている SQL 文を調べる
  ## traceStart() と traceEnd() で挟む事で、間の処理中
  ## に実施された SQL 文を取得可能。

  $db = $this->db;  # interface Zend_Db_Adapter
  DB_Profiler::traceStart( $db );
  ...
  ... 各種 Database 系処理を実施
  ...
  $sqls = DB_Profiler::traceEnd();
  print_r( $sqls );
  # 結果:
  # Array
  # (   
  #     [0] => SELECT `tag`.* FROM `tag` WHERE (tag_url_name = 'birthday')
  #     [1] => DESCRIBE `foo`.`tag_tag_r`
  #     [2] => SELECT `tag_tag_r`.* FROM `tag_tag_r` WHERE (tag_id_child = '100023')
  #     [3] => UPDATE `tag` SET id = ?, tag_url_name = ? [24, birthday]
  #     ...
  # )

 */

class DB_Profiler {
    private static $db;  # interface Zend_Db_Adapter
    private static $db_trace_offset = 0;
    private static $db_started = 0;

    public static function traceStart ( &$_db ){
        if( static::$db_started )
            die( __CLASS__ . ": traceStart() は二重で実行できないよ" );
        static::$db_started = 1;
        $p = $_db->getProfiler();
        $p->setEnabled(true);
        static::$db = $_db;

        ## 前回 traceEnd() 以降で実施された SQL あらば
        ## trace 対象から省く (move forward)
        $arr = $p->getQueryProfiles(); # ゼロ件だと false を返す罠
        if( $arr ){
            $cnt = count( $arr );
            if( $cnt != static::$db_trace_offset )
                static::$db_trace_offset = $cnt;
        }
    }

    ## traceStart() コール後に実行された SQL を配列で返す 
    ## 受け取った側で後は print_r( $array ) 等々すべし
    public static function traceEnd (){
        $p = static::$db->getProfiler();
        $profs = $p->getQueryProfiles();
        $s = array();
        foreach( $profs as $i=>$q ){
            if( $i < static::$db_trace_offset )
                continue;
            $sql = $q->getQuery();
            $qp  = $q->getQueryParams();
            if( $qp )
                $sql .= " [" . join( ", ", $qp ) . "]";
            $s[] = $sql;
        }
        static::$db_trace_offset += count( $s );
        static::$db_started = 0;  # traceStart() 再実行可能に
        return $s;
    }
}

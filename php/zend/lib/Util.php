<?php

## tables to use:
# CREATE TABLE foo (
#     id int AUTO_INCREMENT,
#     text text,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 
#
# CREATE TABLE bar (
#     id int AUTO_INCREMENT,
#     foo_id int NOT NULL,
#     text text,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 

class Util {

    ## DB Table Foo と Bar を初期化 (テストデータ投入)
    public static function setupTableFooAndBar ( $dbh ){
        ## table foo
        $dbh->query( 'TRUNCATE TABLE foo' );
        $sth = $dbh->prepare( 'INSERT INTO foo VALUES (?, ?)' );
        $data = array( 'aaa', 'bbb', 'ccc 日本語', 'ddd' );
        foreach( $data as $i=>$v )
            $sth->execute(array( $i+1, $v ));
        ## table bar
        $dbh->query( 'TRUNCATE TABLE bar' );
        $sth = $dbh->prepare( 'INSERT INTO bar VALUES (null,?,?)' );
        $data = array( '1:a1', '1:a2', '2:b1', '2:b2', '3:c1', '3:c2', '4:d1', '4:d2' );
        foreach( $data as $v ){
            $d = explode( ':', $v );
            $sth->execute( $d );
        }
        return 1;
    }
}

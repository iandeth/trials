<?php

## table to use:
# CREATE TABLE foo (
#     id int AUTO_INCREMENT,
#     text text,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 

class Schema_Foo extends Zend_Db_Table_Abstract {

    protected $_name    = 'foo';
    protected $_primary = 'id';

    ## has_many 設定
    protected $_dependentTables = array('Schema_Bar');

    ## 拡張メソッド
    public function bark (){
        echo "bow wow\n";
    }
}

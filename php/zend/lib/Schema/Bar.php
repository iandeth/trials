<?php

## table to use:
# CREATE TABLE bar (
#     id int AUTO_INCREMENT,
#     foo_id int NOT NULL,
#     text text,
#     PRIMARY KEY (id)
# ) ENGINE=InnoDB; 

class Schema_Bar extends Zend_Db_Table_Abstract {

    protected $_name    = 'bar';
    protected $_primary = 'id';

    ## belongs_to 設定
    protected $_referenceMap = array(
        'Foo' => array(
            'columns'       => array('foo_id'),
            'refTableClass' => 'Schema_Foo',
            'refColumns'    => array('id')
        ),
    );
}

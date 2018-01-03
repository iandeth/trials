<?php

## table to use
# CREATE TABLE `guestbook` (
#     `id` int(11) AUTO_INCREMENT,
#     `user` varchar(50),
#     `content` text,
#     `created` datetime,
#     PRIMARY KEY (`id`)
# ) ENGINE=InnoDB;

class MyProj_Model_DbTable_Guestbook extends Zend_Db_Table_Abstract {

    protected $_name = 'guestbook';
    protected $_primary = 'id';

}


<?php 
/* generated on: 2012-01-04 12:26:32 : 1325647592 */
class MyappSchema extends CakeSchema {

	public function before($event = array()) {
		return true;
	}

	public function after($event = array()) {
	}

	public $categories = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'name' => array('type' => 'string', 'null' => true, 'default' => NULL, 'length' => 50, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'post_count' => array('type' => 'integer', 'null' => true, 'default' => '0', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'sort_order' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
	public $post2s = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'title' => array('type' => 'string', 'null' => true, 'default' => NULL, 'length' => 50, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'body' => array('type' => 'text', 'null' => true, 'default' => NULL, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'tag2_count' => array('type' => 'integer', 'null' => true, 'default' => '0', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'post2s_tag2_count' => array('type' => 'integer', 'null' => true, 'default' => '0', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'created' => array('type' => 'datetime', 'null' => true, 'default' => NULL, 'collate' => NULL, 'comment' => ''),
		'modified' => array('type' => 'datetime', 'null' => true, 'default' => NULL, 'collate' => NULL, 'comment' => ''),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
	public $post2s_tag2s = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'post2_id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'tag2_id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'comment' => array('type' => 'text', 'null' => true, 'default' => NULL, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
	public $posts = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'title' => array('type' => 'string', 'null' => true, 'default' => NULL, 'length' => 50, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'body' => array('type' => 'text', 'null' => true, 'default' => NULL, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'user_id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'category_id' => array('type' => 'integer', 'null' => false, 'default' => '1', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'tag_count' => array('type' => 'integer', 'null' => true, 'default' => '0', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'created' => array('type' => 'datetime', 'null' => true, 'default' => NULL, 'collate' => NULL, 'comment' => ''),
		'modified' => array('type' => 'datetime', 'null' => true, 'default' => NULL, 'collate' => NULL, 'comment' => ''),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
	public $posts_tags = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'post_id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'tag_id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
	public $tag2s = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'name' => array('type' => 'string', 'null' => true, 'default' => NULL, 'length' => 50, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'post2_count' => array('type' => 'integer', 'null' => true, 'default' => '0', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'post2s_tag2_count' => array('type' => 'integer', 'null' => true, 'default' => '0', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
	public $tags = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'name' => array('type' => 'string', 'null' => true, 'default' => NULL, 'length' => 50, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'post_count' => array('type' => 'integer', 'null' => true, 'default' => '0', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
	public $tmp_users = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'hash' => array('type' => 'string', 'null' => false, 'default' => NULL, 'length' => 50, 'key' => 'index', 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'wtype' => array('type' => 'integer', 'null' => true, 'default' => '1', 'length' => 3, 'collate' => NULL, 'comment' => '1=新規ユーザー登録, 2=メアド変更'),
		'created' => array('type' => 'datetime', 'null' => true, 'default' => NULL, 'collate' => NULL, 'comment' => ''),
		'data' => array('type' => 'text', 'null' => true, 'default' => NULL, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1), 'hash' => array('column' => array('hash', 'wtype'), 'unique' => 0)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
	public $users = array(
		'id' => array('type' => 'integer', 'null' => false, 'default' => NULL, 'length' => 20, 'key' => 'primary', 'collate' => NULL, 'comment' => ''),
		'email' => array('type' => 'string', 'null' => false, 'default' => NULL, 'length' => 50, 'key' => 'index', 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'username' => array('type' => 'string', 'null' => false, 'default' => NULL, 'length' => 50, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'password' => array('type' => 'string', 'null' => false, 'default' => NULL, 'length' => 50, 'collate' => 'utf8_general_ci', 'comment' => '', 'charset' => 'utf8'),
		'role' => array('type' => 'string', 'null' => false, 'default' => 'user', 'length' => 20, 'collate' => 'utf8_general_ci', 'comment' => '権', 'charset' => 'utf8'),
		'post_count' => array('type' => 'integer', 'null' => true, 'default' => '0', 'length' => 20, 'collate' => NULL, 'comment' => ''),
		'active' => array('type' => 'integer', 'null' => true, 'default' => '1', 'length' => 3, 'collate' => NULL, 'comment' => '有効フラグ 1=有効, 0=無効'),
		'created' => array('type' => 'datetime', 'null' => true, 'default' => NULL, 'collate' => NULL, 'comment' => ''),
		'modified' => array('type' => 'datetime', 'null' => true, 'default' => NULL, 'collate' => NULL, 'comment' => ''),
		'indexes' => array('PRIMARY' => array('column' => 'id', 'unique' => 1), 'email' => array('column' => array('email', 'active'), 'unique' => 0)),
		'tableParameters' => array('charset' => 'utf8', 'collate' => 'utf8_general_ci', 'engine' => 'InnoDB')
	);
}

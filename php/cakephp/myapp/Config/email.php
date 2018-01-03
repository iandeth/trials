<?php
class EmailConfig {

	# public $default = array(
	# 	'transport' => 'Smtp',
	# 	'from' => array('foo@gmail.com' => 'ianです'),
	# 	'host' => 'ssl://smtp.gmail.com',
	# 	'port' => 465,
	# 	'timeout' => 10,
	# 	'username' => 'foo@gmail.com',
	# 	'password' => 'foo!',
	# 	'log' => false,
	# );

	## Debug モードだと tmp/logs/debug.log に追記される
	## だけ、な挙動になる
	public $default = array(
		'transport' => 'Debug',
		'from' => array('noreply@myapp.com' => 'ianです'),
		'timeout' => 10,
		'log' => true
	);

}

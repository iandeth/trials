<?php
/* User Fixture generated on: 2011-12-26 00:08:54 : 1324825734 */

/**
 * UserFixture
 *
 */
class UserFixture extends CakeTestFixture {

	public $import = 'User';

	public $records = array(
		array(
			'id' => 1,
			'username' => 'ユーザー１',
			'email' => 'user1@foo.com',
			'role' => 'user',
			'password' => 'foo',
			'post_count' => 2,
			'created' => '2011-12-26 00:08:54',
			'modified' => '2011-12-26 00:08:54'
		),
		array(
			'id' => 2,
			'username' => 'ユーザー２',
			'email' => 'user2@foo.com',
			'role' => 'user',
			'password' => 'bar',
			'post_count' => 1,
			'created' => '2011-12-26 00:08:54',
			'modified' => '2011-12-26 00:08:54'
		),
	);
}

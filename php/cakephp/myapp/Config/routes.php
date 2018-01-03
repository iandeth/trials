<?php
//	Router::connect('/', array('controller' => 'pages', 'action' => 'display', 'home'));
	Router::connect('/', array('controller' => 'trials', 'action' => 'index'));
	Router::connect('/pages/*', array('controller' => 'pages', 'action' => 'display'));

	Router::connect(
		'/:user_id/for/:post_id',
		array('controller'=>'trials', 'action'=>'custom_route_action'),
		array(
			'pass' => array('user_id', 'post_id'),
			'user_id' => '[0-9]+',
			'post_id' => '[a-zA-Z]+',
		)
	);

/**
 * Load all plugin routes.  See the CakePlugin documentation on
 * how to customize the loading of plugin routes.
 */
	CakePlugin::routes();

/**
 * Load the CakePHP default routes. Remove this if you do not want to use
 * the built-in default routes.
 */
	require CAKE . 'Config' . DS . 'routes.php';

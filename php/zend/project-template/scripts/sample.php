<?php
$app = require 'bootstrap.php';
$db = $app->getBootstrap()->getResource('db');
var_dump( $db );

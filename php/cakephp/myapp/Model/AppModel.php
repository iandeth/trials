<?php
App::uses('Model', 'Model');

class AppModel extends Model {
	public $recursive = -1;  # relation table を自動で読み込まない
}

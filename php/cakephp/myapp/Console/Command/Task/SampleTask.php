<?php
class SampleTask extends Shell {

   public $uses = array('User');

   public function execute() {
		debug($this->args);
		$user = $this->User->findById($this->args[0]);
		debug($user);
   }
}

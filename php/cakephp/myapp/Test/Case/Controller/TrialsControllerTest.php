<?php
/* Trials Test cases generated on: 2011-12-25 22:26:23 : 1324819583*/
App::uses('TrialsController', 'Controller');

/**
 * TestTrialsController *
 */
class TestTrialsController extends TrialsController {
/**
 * Auto render
 *
 * @var boolean
 */
	public $autoRender = false;

/**
 * Redirect action
 *
 * @param mixed $url
 * @param mixed $status
 * @param boolean $exit
 * @return void
 */
	public function redirect($url, $status = null, $exit = true) {
		$this->redirectUrl = $url;
	}
}

/**
 * TrialsController Test Case
 *
 */
class TrialsControllerTestCase extends CakeTestCase {
/**
 * Fixtures
 *
 * @var array
 */
	public $fixtures = array('app.trial');

/**
 * setUp method
 *
 * @return void
 */
	public function setUp() {
		parent::setUp();

		$this->Trials = new TestTrialsController();
		$this->Trials->constructClasses();
	}

/**
 * tearDown method
 *
 * @return void
 */
	public function tearDown() {
		unset($this->Trials);

		parent::tearDown();
	}

}

<?php

class Validate_PasswordStrength extends Zend_Validate_Abstract {
    const LENGTH = 'length';
    const UPPER  = 'upper';
    const LOWER  = 'lower';
    const DIGIT  = 'digit';
 
    protected $_messageTemplates = array(
        self::LENGTH => "'%value%' must be at least %len% characters in length",
        self::UPPER  => "'%value%' must contain at least one uppercase letter",
        self::LOWER  => "'%value%' must contain at least one lowercase letter",
        self::DIGIT  => "'%value%' must contain at least one digit character"
    );

    protected $_messageVariables = array(
        'len' => '_len',
    );

    protected $_len = 8;
 
    public function __construct ( $opt=array() ){
        if( isset($opt['length']) )
            $this->_len = $opt['length'];
    }

    public function isValid($value) {
        $this->_setValue($value);
        $isValid = true;
 
        if (strlen($value) < $this->_len){
            $this->_error(self::LENGTH);
            $isValid = false;
        }
 
        if (!preg_match('/[A-Z]/', $value)){
            $this->_error(self::UPPER);
            $isValid = false;
        }
 
        if (!preg_match('/[a-z]/', $value)){
            $this->_error(self::LOWER);
            $isValid = false;
        }
 
        if (!preg_match('/\d/', $value)){
            $this->_error(self::DIGIT);
            $isValid = false;
        }
 
        return $isValid;
    }
}

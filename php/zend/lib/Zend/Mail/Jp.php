<?php

class Zend_Mail_Jp extends Zend_Mail {

    public function __construct ($charset=null){
        parent::__construct('ISO-2022-JP');
        $this->setHeaderEncoding(Zend_Mime::ENCODING_BASE64);
    }

    ## 以下日本語文字列を適切にコード変換する為の override methods
    public function setBodyText ($txt, $charset=null, $encoding=Zend_Mime::ENCODING_QUOTEDPRINTABLE){
        return parent::setBodyText($this->cv($txt), null, Zend_Mime::ENCODING_7BIT);
    }

    public function setBodyHtml ($html, $charset=null, $encoding=Zend_Mime::ENCODING_QUOTEDPRINTABLE){
        return parent::setBodyHtml($this->cv($html), null, Zend_Mime::ENCODING_7BIT);
    }

    public function setFrom($email, $name=null){
       return parent::setFrom($email, $this->cv($name, 1));
    }

    public static function setDefaultFrom($email, $name=null){
       return parent::setDefaultFrom($email, $this->cv($name, 1));
    }

    public function setReplyTo($email, $name=null){
       return parent::setReplyTo($email, $this->cv($name, 1));
    }

    public static function setDefaultReplyTo($email, $name=null){
       return parent::setDefaultReplyTo($email, $this->cv($name, 1));
    }

    public function addTo ($email, $name=''){
       return parent::addTo($email, $this->cv($name, 1));
    }

    public function addCc ($email, $name=''){
       return parent::addCc($email, $this->cv($name, 1));
    }

    public function addBcc ($email, $name=''){
       return parent::addBcc($email, $this->cv($name, 1));
    }

    public function setSubject ($subject){
       return parent::setSubject($this->cv($subject, 1));
    }

    ## 文字コード変換 Util 関数
    private function cv ($str, $mime_enc=0){
        if ($str == null)
            return $str;
        $ret = mb_convert_encoding($str, 'ISO-2022-JP', 'UTF-8');
        if (!$mime_enc)
            return $ret;
        ## From, ReplyTo, To で日本語使うときにはこの変換も必要
        return mb_encode_mimeheader($ret, 'ISO-2022-JP');
    }
}

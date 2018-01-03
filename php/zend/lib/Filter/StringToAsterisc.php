<?php
class Filter_StringToAsterisc implements Zend_Filter_Interface {

    ## 入力文字数分、米印を返す
    public function filter ($v=''){
        $a = array_map(function(){
            return '*';
        }, str_split( $v ));
        return implode( '', $a );
    }

}

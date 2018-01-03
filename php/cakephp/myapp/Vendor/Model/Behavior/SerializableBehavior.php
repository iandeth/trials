<?php
App::uses('ModelBehavior', 'Model');
/**
 * Serializable Behavior
 * 
 * <code>
 * var $actsAs = array('Serializable'
 *   => array('fields' => array('serialized_field1', 'serialized_field2')));
 * 
 * // fields are encoded in JSON format before storing to the DB.
 * $Model->save(array(
 *   'serialized_field1' => array(1,2,3),
 *   'serialized_field2' => array('assoc' => 'data')
 * ));
 * 
 * $values = $Model->find('first');
 * // serialized_field1 == array(1,2,3)
 * // serialized_field2 == array('assoc' => 'data')
 * </code>
 * 
 * @copyright     Copyright (c) 2010 Takayuki Miwa <i@tkyk.name>
 * @link          http://wp.serpere.info/archives/1727
 * @license       http://www.opensource.org/licenses/mit-license.php The MIT License
 */

class SerializableBehavior extends ModelBehavior {

    /**
     * @var array
     */
    protected $_defaults = array('fields' => array());

    /**
     * setup callback
     * 
     * options
     * - fields: array(field1, field2,...)
     * 
     * @param object  Model
     * @param array   behavior options
     */
    public function setup($model, $settings=array()) {
        $this->settings[$model->alias] = $settings + $this->_defaults;
    }

    /**
     * Serializes a field value.
     * You can override this method in your models.
     * 
     * @param object  Model
     * @param string  field name
     * @param mixed   values
     * @return string
     */
    public function serializeField($model, $field, $value) {
        return json_encode($value);
    }

    /**
     * Unserializes a field value.
     * You can override this method in your models.
     * 
     * @param object  Model
     * @param string  field name
     * @param string  unserialized form of the field
     * @return mixed
     */
    public function unserializeField($model, $field, $str) {
        return json_decode($str, true); // using assoc array
    }

    /**
     * Unserializes a data record.
     *
     * @param object  Model
     * @param array   reference to the data record
     */
    protected function _unserializeRecord($model, &$record) {
        foreach((array)$this->_config($model, 'fields') as $field) {
            if(array_key_exists($field, $record)) {
                $record[$field] = $model->unserializeField($field, $record[$field]);
            }
        }
    }

    /**
     * beforeSave callback
     * 
     * @param object  Model
     * @param array
     * @return boolean
     */
    function beforeSave($model, $opts=array()) {
        $data = $this->_lookup($model->data, $model->alias, array());
        foreach((array)$this->_config($model, 'fields') as $field) {
            if(array_key_exists($field, $data)) {
                $data[$field] = $model->serializeField($field, $data[$field]);
            }
        }
        $model->data[$model->alias] = $data;
        return true;
    }

    /**
     * afterFind callback
     * 
     * @param object  Model
     * @param boolean
     */
    function afterFind($model, $results, $primary = false) {
        if($primary) {
            foreach($results as $i => $_r) {
                if(!empty($_r[$model->alias])) {
                    $this->_unserializeRecord($model, $results[$i][$model->alias]);
                }
            }
        } else {
            $this->_unserializeRecord($model, $results);
        }
        return $results;
    }

    /**
     * @param array
     * @param string  key
     * @param mixed
     * @return mixed
     */
    protected function _lookup($array, $key, $default = null) {
        return is_array($array) &&
            array_key_exists($key, $array) ? $array[$key] : $default;
    }

    /**
     * @param object  Model
     * @param string
     * @return mixed
     */
    protected function _config($model, $key) {
        return $this->_lookup($this->_lookup($this->settings, $model->alias, array()),
                              $key);
    }

}

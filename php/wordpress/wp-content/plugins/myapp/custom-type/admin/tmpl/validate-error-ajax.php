<?php
foreach($this->errors as $k=>$msgs) {
    $label = $this->form->getElement($k)->getLabel();
    foreach($msgs as $m) {
        echo "<p>[$label] " . $this->escape($m) . '</p>';
    }
}


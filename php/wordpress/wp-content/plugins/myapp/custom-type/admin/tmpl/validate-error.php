<h1 style="color:#880000">validation error</h1>
<ul>
<?php
foreach ($this->errors as $k=>$msgs) {
    $label = $this->form->getElement($k)->getLabel();
    foreach ($msgs as $m)
        echo '<li class="errors">[' . $label . '] ' . $this->escape($m) . '</li>';
}
?>
</ul>

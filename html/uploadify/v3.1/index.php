<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" type="text/css" href="./src/uploadify.css" />
<style type="text/css">
body {
    padding: 20px;
}
.xdebug-var-dump {
    background: #EEE;
    margin: 20px 0;
    padding: 10px;
}
.uploadify-queue-item .cancel a {
    background: url('./src/uploadify-cancel.png') 0 0 no-repeat;
}
</style>
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="./src/jquery.uploadify-3.1.min.js"></script>
<script type="text/javascript">
$(function(){
    var callback = function(file, data, res){
        console.log(file);
        console.log(data);
        console.log(res);
        var data = $.parseJSON(data);
        console.log(data);
        $('input[name=uploaded]').val(data['Filedata']['name']);
    };
    var error_callback = function(file, e_code, e_msg, e_str){
        console.error(file);
        console.error(e_code + ' | ' + e_msg + ' | ' + e_str);
    };
    $('#up2').uploadify({
        debug: true,
        uploader: 'upload.php',
        swf: './src/uploadify.swf',
        onUploadSuccess: callback,
        onUploadError: error_callback,
        auto: true,
        multi: true,
        fileSizeLimit: '100KB',
        fileTypeExts: '*.jpg; *.png'
    });
});
</script>
</head>
<body>
<h2>uploadify v3.1 test</h2>
<form method="post" id="form2">
    <input type="hidden" name="uploaded" value=""/>
    <input type="hidden" name="foo" value="1"/>
    <input type="file" id="up2" name="up2"/><br/>
    <input type="submit" value="save"/>
</form>
<?php
    if ($_POST) {
        var_dump($_POST);
    }
?>
</body>
</html>

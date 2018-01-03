<?php
error_reporting( E_ALL | E_STRICT );
ini_set( 'display_errors', 'On' );

## テスト用ファイル
$file = dirname(__FILE__) . '/file-test.txt';


echo "## write\n";
$m = function () use( $file ){
    $c = join( "\n", array( 'aaa', 'bbb', 'ccc' ) ) . "\n";

    $fh = fopen( $file, 'w' )
        or trigger_error( "fopen failed", E_USER_ERROR );
    if( flock( $fh, LOCK_EX ) ){
        fwrite( $fh, $c );
        flock( $fh, LOCK_UN );  # unlock
    }
    fclose( $fh );
};
$m();


echo "\n## open+write at once\n";
$m = function () use( $file ){
    $c = "ddd\n";

    $ok = file_put_contents( $file, $c, FILE_APPEND | LOCK_EX )
        or trigger_error( "file_put_contents failed", E_USER_ERROR );
};
$m();


echo "\n## loop read\n";
$m = function () use( $file ){
    $fh = fopen( $file, 'r' )
        or trigger_error( "fopen failed", E_USER_ERROR );
    while ( $r = fgets( $fh ) ){
        $r = rtrim( $r );
        echo "xxx: $r\n";
    }
};
$m();


echo "\n## read content to array\n";
$m = function () use( $file ){
    $arr = file( $file, FILE_IGNORE_NEW_LINES )
        or trigger_error( "file failed", E_USER_ERROR );
    foreach ( $arr as $v ){
        echo "yyy: $v\n";
    }
};
$m();


echo "\n## read content to string\n";
$m = function () use( $file ){
    $str = file_get_contents( $file );
    if( $str === false )
        trigger_error( "file_get_contents failed", E_USER_ERROR );
    echo $str;
};
$m();


echo "\n## stats\n";
$m = function () use( $file ){
    echo "file_exists  : ", file_exists( $file ), "\n";
    echo "is_file      : ", is_file( $file ), "\n";
    echo "is_dir       : ", is_dir( $file ), "\n";
    echo "is_link      : ", is_link( $file ), "\n";
    echo "is_writeable : ", is_writeable( $file ), "\n";
    echo "filetype     : ", filetype( $file ), "\n";
    echo "filesize     : ", filesize( $file ), "\n";
};
$m();


echo "\n## delete\n";
$m = function () use( $file ){
    $ok = unlink( $file )
        or trigger_error( "unlink failed", E_USER_ERROR );
};
$m();


echo "\n## glob\n";
$m = function () use( $file ){
    $arr = glob( "namespace/*" );
    foreach( $arr as $file ){
        echo "$file\n";
    }
};
$m();

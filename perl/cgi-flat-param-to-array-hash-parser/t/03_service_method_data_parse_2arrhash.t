use Test::More tests => 11;
use strict;
use warnings;
use Test::Exception;

BEGIN {
    use_ok( 'Parser' );
}

{
    ## basic
    my $data = {
        id         => 1,
        title      => '不動の山さん',
        fld1_id    => 23455,
        fld1_lat   => 134,
        fld1_label => '蒲田支店勤務',
        fld2_arr   => ['a','b'],
        fld2_text  => 'かきく',
        'fields()' => '2arrhash(fld)',
    };
    my $ret = Parser->service_method_data_parse( $data );
    my $expect = {
        id     => 1,
        title  => '不動の山さん',
        fields => [
            { id=>23455, lat=>134, label=>'蒲田支店勤務' },
            { arr=>['a','b'], text=>'かきく' },
        ],
    };
    is_deeply $ret, $expect;

    ## default parse target keyname is 'fld', so can say just '2arrhash' instead of '2arrhash(fld)'
    $data = {
        id         => 1,
        title      => '不動の山さん',
        fld1_id    => 23455,
        fld1_lat   => 134,
        fld1_label => '蒲田支店勤務',
        fld2_arr   => ['a','b'],
        fld2_text  => 'かきく',
        'fields()' => '2arrhash',
    };
    $ret = Parser->service_method_data_parse( $data );
    is_deeply $ret, $expect;
}
{
    ## OK pattern - 2 directives
    my $data = {
        id             => 1,
        title          => '不動の山さん',
        fld1_id        => 23455,
        fld1_label     => '蒲田支店勤務',
        fld2_arr       => ['a','b'],
        fld2_text      => 'かきく',
        'fields()'     => '2arrhash(fld)',
        cat1_id        => 93,
        cat2_id        => 94,
        'categories()' => '2arrhash(cat)',
    };
    my $ret = Parser->service_method_data_parse( $data );
    my $expect = {
        id     => 1,
        title  => '不動の山さん',
        fields => [
            { id=>23455, label=>'蒲田支店勤務' },
            { arr=>['a','b'], text=>'かきく' },
        ],
        categories => [
            { id=>93 },
            { id=>94 },
        ],
    };
    is_deeply $ret, $expect;
}
{
    ## nothing happens if no directive found
    my $data = {
        id         => 1,
        title      => '不動の山さん',
        fld1_id    => 23455,
        fld1_lat   => 134,
        fld1_label => '蒲田支店勤務',
        fld2_id    => 23456,
        fld2_text  => 'かきく',
        # 'fields()' => '2arrhash(fld)',
    };
    my $ret = Parser->service_method_data_parse( $data );
    is $data, $ret;

    ## nothing happens if directive mis-typed
    $data = {
        id         => 1,
        title      => '不動の山さん',
        fld1_id    => 23455,
        fld1_lat   => 134,
        fld1_label => '蒲田支店勤務',
        fld2_id    => 23456,
        fld2_text  => 'かきく',
        'fields(' => '2arrhash(fld)',
    };
    $ret = Parser->service_method_data_parse( $data );
    is $data, $ret;

    ## nothing happens if directive is empty
    $data = {
        id         => 1,
        title      => '不動の山さん',
        fld1_id    => 23455,
        fld1_lat   => 134,
        fld1_label => '蒲田支店勤務',
        fld2_id    => 23456,
        fld2_text  => 'かきく',
        '()'       => '2arrhash(fld)',
    };
    $ret = Parser->service_method_data_parse( $data );
    is $data, $ret;
}
{
    ## error pattern - outname already exists
    my $data = {
        fields     => 1,
        fld1_label => '蒲田支店勤務',
        fld2_text  => 'かきく',
        'fields()' => '2arrhash(fld)',
    };
    throws_ok {
        Parser->service_method_data_parse( $data );
    } qr/fields\(\) parse failed\. Param with the same key name already exists: fields/;

    ## error pattern - unsupported method name
    $data = {
        id         => 1,
        fld1_label => '蒲田支店勤務',
        fld2_text  => 'かきく',
        'fields()' => 'foo',
    };
    throws_ok {
        Parser->service_method_data_parse( $data );
    } qr/fields\(\) parse failed\. No such method supported: foo/;

    ## error pattern - no method specified
    $data = {
        id         => 1,
        fld1_label => '蒲田支店勤務',
        fld2_text  => 'かきく',
        'fields()' => '',
    };
    throws_ok {
        Parser->service_method_data_parse( $data );
    } qr/fields\(\) parse failed\. No such method supported:/;
}
{
    ## key with unknown format gets ignored
    my $data = {
        id         => 1,
        fld1_id    => 23455,
        fld1_      => 134,   # unknown format
        'fields()' => '2arrhash(fld)',
    };
    my $ret = Parser->service_method_data_parse( $data );
    my $expect = {
        id     => 1,
        fld1_  => 134,   # stays as is
        fields => [
            { id=>23455 },
        ],
    };
    is_deeply $ret, $expect;
}


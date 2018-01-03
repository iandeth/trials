use Test::More tests => 13;
use strict;
use warnings;
use Test::Exception;

BEGIN {
    use_ok( 'Parser' );
}
{
    ## basic
    my $data = {
        id       => 1,
        title    => '不動の山さん',
        "tree[]" => q/{"bar":[1,2],"foo":"あ"}/,
    };
    my $ret = Parser->service_method_data_parse( $data );
    my $expect = {
        id    => 1,
        title => '不動の山さん',
        tree  => {
            foo => "あ",
            bar => [1,2],
        },
    };
    is_deeply $ret, $expect;

    ## basic - "tree{}" instead of "tree[]" works the same
    $data = {
        id         => 1,
        title      => '不動の山さん',
        "tree{}"   => q/{"bar":[1,2],"foo":"あ"}/,
    };
    $ret = Parser->service_method_data_parse( $data );
    is_deeply $ret, $expect;
}
{
    ## basic - multiple directives
    my $data = {
        id       => 1,
        title    => '不動の山さん',
        "tree[]" => q/{"bar":[1,2],"foo":"あ"}/,
        "tree2{}" => q/["buz","qux"]/,
    };
    my $ret = Parser->service_method_data_parse( $data );
    my $expect = {
        id    => 1,
        title => '不動の山さん',
        tree  => {
            foo => "あ",
            bar => [1,2],
        },
        tree2 => [ 'buz', 'qux' ],
    };
    is_deeply $ret, $expect;
}
{
    ## basic - can accept single quotes, as it's strictly an invalid JSON format
    my $data = {
        id       => 1,
        title    => '不動の山さん',
        "tree[]" => q/{'bar':[1,2],'foo':'あ'}/,  # instead of q/{"bar":[1,2],"foo":"あ"}/
    };
    my $ret = Parser->service_method_data_parse( $data );
    my $expect = {
        id    => 1,
        title => '不動の山さん',
        tree  => {
            foo => "あ",
            bar => [1,2],
        },
    };
    is_deeply $ret, $expect;
}
{
    ## nothing happens - directive typo
    my $data = {
        id         => 1,
        title      => '不動の山さん',
        "tree[" => q/{"bar":[1,2],"foo":"あ"}/,
    };
    my $ret = Parser->service_method_data_parse( $data );
    is_deeply $data, $ret;

    ## nothing happens - wrong directive
    $data = {
        id       => 1,
        title    => '不動の山さん',
        "[]tree" => q/{"bar":[1,2],"foo":"あ"}/,
    };
    $ret = Parser->service_method_data_parse( $data );
    is_deeply $data, $ret;

    ## nothing happens - white spaces in directive
    $data = {
        id       => 1,
        title    => '不動の山さん',
        "tree[ ]" => q/{"bar":[1,2],"foo":"あ"}/,
    };
    $ret = Parser->service_method_data_parse( $data );
    is_deeply $data, $ret;
}
{
    ## unexpected pattern - empty string
    my $data = {
        id         => 1,
        title      => '不動の山さん',
        "tree[]"   => '',
    };
    my $ret = Parser->service_method_data_parse( $data );
    my $expect = {
        id    => 1,
        title => '不動の山さん',
    };
    is_deeply $ret, $expect;

    ## unexpected pattern - undef
    $data = {
        id         => 1,
        title      => '不動の山さん',
        "tree[]"   => undef,
    };
    $ret = Parser->service_method_data_parse( $data );
    is_deeply $ret, $expect;
}
{
    ## error pattern - outname already exists
    my $data = {
        id       => 1,
        title    => '不動の山さん',
        "tree[]" => q/{"bar":[1,2],"foo":"あ"}/,
        tree     => 1,
    };
    throws_ok {
        Parser->service_method_data_parse( $data );
    } qr/tree\[\] parse failed\. Param with the same key name already exists: tree/;

    ## error pattern - not a json, but some other data type
    $data = {
        id       => 1,
        title    => '不動の山さん',
        "tree[]" => [1,2],
    };
    throws_ok {
        Parser->service_method_data_parse( $data );
    } qr/tree\[\] is not a json string: ARRAY\(.+?\)/;

    ## error pattern - malformed json string
    $data = {
        id       => 1,
        title    => '不動の山さん',
        "tree[]" => q/"bar":[1,2],"foo":"あ"/,
    };
    dies_ok {
        Parser->service_method_data_parse( $data );
    };
}


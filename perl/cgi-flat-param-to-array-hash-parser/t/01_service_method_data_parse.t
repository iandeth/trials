use Test::More tests => 2;
use strict;
use warnings;
use Test::Exception;

BEGIN {
    use_ok( 'Parser' );
}
{
    ## 2arrhash + json2perl combined
    my $data = {
        id           => 1,
        title        => '不動の山さん',
        fld1_id      => 23455,
        fld1_lat     => 134,
        fld1_label   => '蒲田支店勤務',
        "fld2_obj[]" => q/{"bar":[1,2],"foo":"あ"}/,
        fld2_text    => 'かきく',
        'fields()'   => '2arrhash(fld)',
    };
    my $ret = Parser->service_method_data_parse( $data );
    my $expect = {
        id     => 1,
        title  => '不動の山さん',
        fields => [
            { id=>23455, lat=>134, label=>'蒲田支店勤務' },
            { obj=>{ bar=>[1,2], foo=>"あ" }, text=>'かきく' },
        ],
    };
    is_deeply $ret, $expect;
}


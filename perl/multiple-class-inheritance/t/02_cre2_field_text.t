use Test::More tests=>24;
use strict;
use NormalPerl::Creyle2::Field::Text;
use C3::Creyle2::Field::Text;

{
    ## prop basics
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},            'prop_cre2_val';
        is $tgt->{prop_cre2_field},      'prop_cre2_field_val';
        is $tgt->{prop_cre2_field_text}, 'prop_cre2_field_text_val';
    };
    $proc->( NormalPerl::Creyle2::Field::Text->new );
    $proc->( C3::Creyle2::Field::Text->new );
}
{
    ## with prop set
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},            'foo';
        is $tgt->{prop_cre2_field},      'bar';
        is $tgt->{prop_cre2_field_text}, 'baz';
    };
    my %opt = (
        prop_cre2            => 'foo',
        prop_cre2_field      => 'bar',
        prop_cre2_field_text => 'baz',
    );
    $proc->( NormalPerl::Creyle2::Field::Text->new( %opt ) );
    $proc->( C3::Creyle2::Field::Text->new( %opt ) );
}
{
    ## with partial prop set
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},            'prop_cre2_val';
        is $tgt->{prop_cre2_field},      'bar';
        is $tgt->{prop_cre2_field_text}, 'baz';
    };
    my %opt = (
        prop_cre2_field      => 'bar',
        prop_cre2_field_text => 'baz',
    );
    $proc->( NormalPerl::Creyle2::Field::Text->new( %opt ) );
    $proc->( C3::Creyle2::Field::Text->new( %opt ) );
}
{
    ## method basics
    my $proc = sub {
        my $tgt = shift;
        is   $tgt->method_cre2,            "method_cre2 called";
        like $tgt->method_cre2_field,      qr/^method_cre2_field overrided by (NormalPerl|C3)::Creyle2::Field::Text$/;
        is   $tgt->method_cre2_field_text, "method_cre2_field_text called";
    };
    $proc->( NormalPerl::Creyle2::Field::Text->new );
    $proc->( C3::Creyle2::Field::Text->new );
}

use Test::More tests=>36;
use strict;
use NormalPerl::Chintai::Field::Text;
use C3::Chintai::Field::Text;

{
    ## prop basics
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},               'prop_cre2_val';
        is $tgt->{prop_cre2_field},         'prop_cre2_field_val';
        is $tgt->{prop_chintai_field},      'prop_chintai_field_val';
        is $tgt->{prop_chintai_field_text}, 'prop_chintai_field_text_val';
    };
    $proc->( NormalPerl::Chintai::Field::Text->new );
    $proc->( C3::Chintai::Field::Text->new );
}
{
    ## with prop set
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},               'foo';
        is $tgt->{prop_cre2_field},         'bar';
        is $tgt->{prop_chintai_field},      'baz';
        is $tgt->{prop_chintai_field_text}, 'qux';
    };
    my %opt = (
        prop_cre2               => 'foo',
        prop_cre2_field         => 'bar',
        prop_chintai_field      => 'baz',
        prop_chintai_field_text => 'qux',
    );
    $proc->( NormalPerl::Chintai::Field::Text->new( %opt ) );
    $proc->( C3::Chintai::Field::Text->new( %opt ) );
}
{
    ## with partial prop set
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},               'prop_cre2_val';
        is $tgt->{prop_cre2_field},         'bar';
        is $tgt->{prop_chintai_field},      'baz';
        is $tgt->{prop_chintai_field_text}, 'prop_chintai_field_text_val';
    };
    my %opt = (
        prop_cre2_field    => 'bar',
        prop_chintai_field => 'baz',
    );
    $proc->( NormalPerl::Chintai::Field::Text->new( %opt ) );
    $proc->( C3::Chintai::Field::Text->new( %opt ) );
}
{
    ## method basics
    my $proc = sub {
        my $tgt = shift;
        is   $tgt->method_cre2,               "method_cre2 called";
        like $tgt->method_cre2_field,         qr/^method_cre2_field overrided by (NormalPerl|C3)::Creyle2::Field::Text$/;  # this depends on use base qw// order
        like $tgt->method_cre2_field_text,    qr/^method_cre2_field_text overrided by (NormalPerl|C3)::Chintai::Field::Text$/;
        is   $tgt->method_chintai,            "method_chintai called";
        like $tgt->method_chintai_field,      qr/^method_chintai_field overrided by (NormalPerl|C3)::Chintai::Field::Text$/;
        is   $tgt->method_chintai_field_text, "method_chintai_field_text called";
    };
    $proc->( NormalPerl::Chintai::Field::Text->new );
    $proc->( C3::Chintai::Field::Text->new );
}


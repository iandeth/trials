use Test::More tests=>26;
use strict;
use NormalPerl::Chintai::Field;
use C3::Chintai::Field;

{
    ## prop basics
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},          'prop_cre2_val';
        is $tgt->{prop_cre2_field},    'prop_cre2_field_val';
        is $tgt->{prop_chintai_field}, 'prop_chintai_field_val';
    };
    $proc->( NormalPerl::Chintai::Field->new );
    $proc->( C3::Chintai::Field->new );
}
{
    ## with prop set
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},          'foo';
        is $tgt->{prop_cre2_field},    'bar';
        is $tgt->{prop_chintai_field}, 'baz';
    };
    my %opt = (
        prop_cre2          => 'foo',
        prop_cre2_field    => 'bar',
        prop_chintai_field => 'baz',
    );
    $proc->( NormalPerl::Chintai::Field->new( %opt ) );
    $proc->( C3::Chintai::Field->new( %opt ) );
}
{
    ## with partial prop set
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},          'prop_cre2_val';
        is $tgt->{prop_cre2_field},    'bar';
        is $tgt->{prop_chintai_field}, 'baz';
    };
    my %opt = (
        prop_cre2_field    => 'bar',
        prop_chintai_field => 'baz',
    );
    $proc->( NormalPerl::Chintai::Field->new( %opt ) );
    $proc->( C3::Chintai::Field->new( %opt ) );
}
{
    ## method basics
    my $proc = sub {
        my $tgt = shift;
        is $tgt->method_cre2,          "method_cre2 called";
        like $tgt->method_cre2_field,  qr/^method_cre2_field overrided by (NormalPerl|C3)::Chintai::Field$/;
        is $tgt->method_chintai,       "method_chintai called";
        is $tgt->method_chintai_field, "method_chintai_field called";
    };
    $proc->( NormalPerl::Chintai::Field->new );
    $proc->( C3::Chintai::Field->new );
}

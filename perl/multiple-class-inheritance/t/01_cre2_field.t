use Test::More tests=>12;
use strict;
use NormalPerl::Creyle2::Field;
use C3::Creyle2::Field;

{
    ## prop basics
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},       'prop_cre2_val';
        is $tgt->{prop_cre2_field}, 'prop_cre2_field_val';
    };
    $proc->( NormalPerl::Creyle2::Field->new );
    $proc->( C3::Creyle2::Field->new );
}
{
    ## with prop set
    my $proc = sub {
        my $tgt = shift;
        is $tgt->{prop_cre2},       'foo';
        is $tgt->{prop_cre2_field}, 'bar';
    };
    my %opt = (
        prop_cre2       => 'foo',
        prop_cre2_field => 'bar',
    );
    $proc->( NormalPerl::Creyle2::Field->new( %opt ) );
    $proc->( C3::Creyle2::Field->new( %opt ) );
}
{
    ## method basics
    my $proc = sub {
        my $tgt = shift;
        is $tgt->method_cre2,       "method_cre2 called";
        is $tgt->method_cre2_field, "method_cre2_field called";
    };
    $proc->( NormalPerl::Creyle2::Field->new );
    $proc->( C3::Creyle2::Field->new );
}

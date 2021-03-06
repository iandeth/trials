package NormalPerl::Chintai::Field;
use base qw/NormalPerl::Creyle2::Field/;
use strict;
our $NEW_COUNT = 0;  # for test

sub new {
    $NEW_COUNT++;
    my $class = shift;
    my $self  = $class->SUPER::new(@_);
    my %options = @_;
    my $p = {
        prop_chintai_field => 'prop_chintai_field_val',
    };
    foreach my $k ( keys %$p ){
        $self->{$k} = ( defined $options{$k} )? $options{$k} : $p->{$k};
    }
    return $self;
}

sub method_chintai {
    return "method_chintai called";
}

sub method_chintai_field {
    return "method_chintai_field called";
}

## override parent method - NormalPerl::Creyle2::Field
sub method_cre2_field {
    return "method_cre2_field overrided by " . __PACKAGE__;
}

1;


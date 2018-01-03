package NormalPerl::Creyle2::Field::Text;
use base qw/NormalPerl::Creyle2::Field/;
use strict;
our $NEW_COUNT = 0;  # for test

sub new {
    $NEW_COUNT++;
    my $class = shift;
    my $self  = $class->SUPER::new(@_);
    my %options = @_;
    my $p = {
        prop_cre2_field_text => 'prop_cre2_field_text_val',
    };
    foreach my $k ( keys %$p ){
        $self->{$k} = ( defined $options{$k} )? $options{$k} : $p->{$k};
    }
    return $self;
}

sub method_cre2_field_text {
    return "method_cre2_field_text called";
}

## override parent method - NormalPerl::Creyle2::Field
sub method_cre2_field {
    return "method_cre2_field overrided by " . __PACKAGE__;
}


1;

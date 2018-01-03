package C3::Chintai::Field;
use base qw/C3::Creyle2::Field/;
use Class::C3;
use strict;
our $NEW_COUNT = 0;  # for test

sub new {
    $NEW_COUNT++;
    my $class = shift;
    my %options = @_;
    my $self = $class->next::method(@_);
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

## override parent method - C3::Creyle2::Field
sub method_cre2_field {
    return "method_cre2_field overrided by " . __PACKAGE__;
}

INIT {
    Class::C3::initialize();
}

1;


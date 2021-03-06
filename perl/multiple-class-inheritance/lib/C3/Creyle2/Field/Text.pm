package C3::Creyle2::Field::Text;
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

## override parent method - C3::Creyle2::Field
sub method_cre2_field {
    return "method_cre2_field overrided by " . __PACKAGE__;
}

INIT {
    Class::C3::initialize();
}

1;

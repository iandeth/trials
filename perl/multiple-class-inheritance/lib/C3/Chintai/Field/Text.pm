package C3::Chintai::Field::Text;
use base qw/C3::Creyle2::Field::Text C3::Chintai::Field/;
use Class::C3;
use strict;
our $NEW_COUNT = 0;  # for test

sub new {
    $NEW_COUNT++;
    my $class = shift;
    my %options = @_;
    my $self = $class->next::method(@_);
    my $p = {
        prop_chintai_field_text => 'prop_chintai_field_text_val',
    };
    foreach my $k ( keys %$p ){
        $self->{$k} = ( defined $options{$k} )? $options{$k} : $p->{$k};
    }
    return $self;
}

sub method_chintai_field_text {
    return "method_chintai_field_text called";
}

## override parent method - C3::Creyle2::Field::Text
sub method_cre2_field_text {
    return "method_cre2_field_text overrided by " . __PACKAGE__;
}

## override parent method - C3::Chintai::Field
sub method_chintai_field {
    return "method_chintai_field overrided by " . __PACKAGE__;
}

INIT {
    Class::C3::initialize();
    #warn "\n\ninheritance tree:\n" . join( ', ' => Class::C3::calculateMRO( 'C3::Chintai::Field::Text' ) ) . "\n\n";
}

1;


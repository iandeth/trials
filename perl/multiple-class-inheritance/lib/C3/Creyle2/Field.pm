package C3::Creyle2::Field;
#use Class::C3;
use strict;
our $NEW_COUNT = 0;  # for test

sub new {
    $NEW_COUNT++;
    my $class = shift;
    my %options = @_;
    my $p = {
        prop_cre2       => 'prop_cre2_val',
        prop_cre2_field => 'prop_cre2_field_val',        
    };
    foreach my $k ( keys %$p ){
        $p->{$k} = $options{$k} if defined $options{$k};
    }
    my $self = bless $p, $class;
    return $self;
}

sub method_cre2 {
    return "method_cre2 called";
}

sub method_cre2_field {
    return "method_cre2_field called";
}

#INIT {
#    Class::C3::reinitialize();
#}

1;


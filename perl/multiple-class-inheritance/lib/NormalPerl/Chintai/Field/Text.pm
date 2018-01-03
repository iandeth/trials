package NormalPerl::Chintai::Field::Text;
use base qw/NormalPerl::Creyle2::Field::Text NormalPerl::Chintai::Field/;
use strict;
our $NEW_COUNT = 0;  # for test

sub new {
    $NEW_COUNT++;
    my $class = shift;
    my %options = @_;
    my $self = bless {}, $class;

    ## simple alternative of $class->SUPER::new() under multiple inheritance
    ## downside of this approach is that the root class of @ISA hierarchy's
    ## new() gets called multiple times.
    ## with this case, Creyle2::Field->new() gets called twice.
    my @isa = eval '@' . $class . "::ISA";
    foreach my $sclass ( @isa ){
        my $super = $sclass->new(@_); 
        foreach my $k ( %$super ){
            $self->{$k} = $super->{$k}; 
        }
    }

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

## override parent method - NormalPerl::Creyle2::Field::Text
sub method_cre2_field_text {
    return "method_cre2_field_text overrided by " . __PACKAGE__;
}

## override parent method - NormalPerl::Chintai::Field
sub method_chintai_field {
    return "method_chintai_field overrided by " . __PACKAGE__;
}

1;


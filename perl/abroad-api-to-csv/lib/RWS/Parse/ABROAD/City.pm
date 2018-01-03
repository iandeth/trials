package RWS::Parse::ABROAD::City;
use base qw( RWS::Parse::ABROAD::Base );
use strict;

sub _init {
    my $self = shift;
    $self->SUPER::_init( @_ );
    $self->{name} = 'city';
}

sub _init_fetcher {
    my $self = shift;
    return RWS::Fetch->new(
        api => '/ab-road/city/v1',
        key => $self->{api}{key},
        params => {
            in_use => 0,
            count  => 100,
        },
    );
}

sub _create_csv_each_row {
    my $self = shift;
    my $row  = shift;
    return [
        $row->{code},
        $row->{name},
        $row->{tour_count},
        $row->{area}{code},
        $row->{area}{name},
        $row->{country}{code},
        $row->{country}{name},
    ];
}

1;

